import React, { useState, useMemo, useEffect } from 'react';
import { Board, Category, FeedItem, FeedItemType, KanbanStatus, SavingsGoal, TrackedBill, User } from '../types';
import BillManagementModal from './BillManagementModal';
import IntegrationModal from './IntegrationModal';
import FeedItemCard from './FeedItemCard';
import KanbanBoard from './KanbanBoard';
import SavingsGoalsBoard from './SavingsGoalsBoard';

interface DashboardPageProps {
    user: User | null;
    addBill: (bill: Omit<TrackedBill, 'id'>) => Promise<void>;
    updateBill: (bill: TrackedBill) => Promise<void>;
    deleteBill: (billId: string) => Promise<void>;
    upgradeToPremium: () => Promise<void>;
    addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
}

const generateFeedItems = (bills: TrackedBill[], isPremium: boolean): FeedItem[] => {
    const items: FeedItem[] = [];

    if (bills.length === 0) {
        items.push({
            id: 'welcome',
            type: FeedItemType.Insight,
            title: 'Welcome to Compass Control!',
            description: 'Add your first bill manually or by connecting an account to start seeing personalized insights and savings opportunities.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
            isPremiumLocked: false,
            ctaText: 'Add First Bill',
        });
    }

    const overdueBills = bills.filter(b => b.status === KanbanStatus.Overdue);
    if (overdueBills.length > 0) {
        items.push({
            id: 'overdue-alert',
            type: FeedItemType.Alert,
            title: `${overdueBills.length} Bill${overdueBills.length > 1 ? 's are' : ' is'} Overdue`,
            description: `You have ${overdueBills.length} bill${overdueBills.length > 1 ? 's' : ''} past the due date. Pay them soon to avoid late fees.`,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
            isPremiumLocked: false,
            ctaText: 'View Overdue Bills',
        });
    }

    const highestBill = bills.length > 0 ? bills.reduce((max, bill) => bill.monthlyCost > max.monthlyCost ? bill : max, bills[0]) : null;
    if (highestBill) {
         items.push({
            id: 'premium-savings',
            type: FeedItemType.Insight,
            title: `Potential Savings on Your ${highestBill.provider} Bill`,
            description: `We've analyzed the market and found plans that could save you up to £${(highestBill.monthlyCost * 0.2).toFixed(2)} per month. Unlock to see the details.`,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
            isPremiumLocked: !isPremium,
            ctaText: 'View Opportunities',
        });
    }

    if (bills.length === 1) {
        items.push({
            id: 'first-bill',
            type: FeedItemType.Gamification,
            title: 'First Bill Added!',
            description: "You're on your way to financial clarity. The more bills you add, the smarter our insights become.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16m-7-2h2" /></svg>,
            isPremiumLocked: false,
        });
    }
    
    if (!isPremium) {
        items.push({
            id: 'premium-cta-main',
            type: FeedItemType.PremiumCTA,
            title: 'Supercharge Your Savings with Premium',
            description: 'Unlock unlimited bill tracking, automated savings opportunities, and detailed spending trends for just £5.99/month.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2 2 0 00-2 2v1.944a2 2 0 01-.412 1.255L4.29 9.586A2 2 0 004 11v3a2 2 0 002 2h8a2 2 0 002-2v-3a2 2 0 00-.29-.986l-3.298-2.387A2 2 0 0112 5.944V4a2 2 0 00-2-2z" /><path d="M3 16a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1z" /></svg>,
            isPremiumLocked: true, 
            ctaText: 'Upgrade Now',
        });
    }

    return items;
};

interface BillItemProps {
    bill: TrackedBill;
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
    style?: React.CSSProperties;
}

const BillItem: React.FC<BillItemProps> = ({ bill, onEdit, onDelete, className, style }) => {
    const categoryIcons: Record<Category, React.ReactNode> = {
        [Category.Broadband]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        [Category.Energy]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        [Category.Insurance]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
        [Category.Mobile]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
        [Category.Loans]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        [Category.CreditCards]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
        [Category.CurrentAccounts]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        [Category.Mortgages]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        [Category.Other]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>,
    };
    const isAutomated = !!bill.source;

    return (
        <div 
          className={`bg-slate-800/50 backdrop-blur-lg border border-white/20 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:bg-slate-700/60 hover:-translate-y-1 ${className || ''}`}
          style={style}
        >
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 text-slate-300 rounded-lg flex items-center justify-center">
                {categoryIcons[bill.category] || categoryIcons.Other}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-white">{bill.provider}</p>
                 <div className="flex items-center gap-1.5">
                    <p className="text-sm text-slate-400">{bill.name}</p>
                    {isAutomated && (
                        <div className="flex items-center gap-1 text-xs text-tech-blue font-medium bg-tech-blue/20 px-1.5 py-0.5 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828l1.5 1.5 3-3z" clipRule="evenodd" /><path fillRule="evenodd" d="M6.414 11.586a2 2 0 10-2.828 2.828l3 3a2 2 0 002.828 0l1.5-1.5a2 2 0 10-2.828-2.828l-1.5 1.5-3-3z" clipRule="evenodd" /></svg>
                            <span>via {bill.source}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-lg bg-gradient-to-r from-tech-blue to-emerald-save text-transparent bg-clip-text">£{bill.monthlyCost.toFixed(2)}</p>
                <p className="text-sm text-slate-400">/month</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
                <button
                    onClick={onEdit}
                    disabled={isAutomated}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-slate-300 hover:bg-tech-blue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:text-slate-300"
                    title={isAutomated ? "Automated bills cannot be edited" : "Edit bill"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                </button>
                <button
                    onClick={onDelete}
                    disabled={isAutomated}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-slate-300 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:text-slate-300"
                    title={isAutomated ? "Automated bills cannot be deleted" : "Delete bill"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
            </div>
        </div>
    );
};

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { user, addBill, updateBill, deleteBill, upgradeToPremium, addSavingsGoal } = props;
  
  const [activeBoard, setActiveBoard] = useState<Board>('overview');
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState<TrackedBill | undefined>(undefined);
  
  const [integrationModalState, setIntegrationModalState] = useState<{
      isOpen: boolean;
      integration: { name: string; domain: string; category: Category } | null;
  }>({ isOpen: false, integration: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const integrations: { name: string; domain: string; category: Category }[] = [
    { name: 'Monzo', domain: 'monzo.com', category: Category.CurrentAccounts },
    { name: 'Revolut', domain: 'revolut.com', category: Category.CurrentAccounts },
    { name: 'British Gas', domain: 'britishgas.co.uk', category: Category.Energy },
    { name: 'Octopus Energy', domain: 'octopus.energy', category: Category.Energy },
  ];

  if (!user) {
    return <div className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div></div>;
  }

  const { isPremium, trackedBills, savingsGoals } = user;
  const feedItems = useMemo(() => generateFeedItems(trackedBills, isPremium), [trackedBills, isPremium]);

  const handleAddBillClick = () => {
    if (!isPremium && trackedBills.length >= 3) {
      upgradeToPremium();
      return;
    }
    setBillToEdit(undefined);
    setIsBillModalOpen(true);
  };

  const handleEditBillClick = (bill: TrackedBill) => {
    setBillToEdit(bill);
    setIsBillModalOpen(true);
  };

  const handleSaveBill = async (billData: Omit<TrackedBill, 'id'> | TrackedBill) => {
    setIsLoading(true);
    if ('id' in billData) {
      await updateBill(billData);
    } else {
      await addBill(billData);
    }
    setIsLoading(false);
    setIsBillModalOpen(false);
  };
  
  const handleOpenIntegrationModal = (integration: { name: string; domain: string; category: Category }) => {
    setIntegrationModalState({ isOpen: true, integration });
  };
  
  const boards: { id: Board; label: string; isPremium: boolean; }[] = [
    { id: 'overview', label: 'Overview', isPremium: false },
    { id: 'bills', label: 'Bills', isPremium: false },
    { id: 'savings', label: 'Savings Goals', isPremium: true },
  ];

  return (
    <>
      <section className="hero-cinematic w-full relative min-h-screen">
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tighter [text-shadow:0_2px_10px_rgba(0,0,0,0,0.3)]">Compass OS</h1>
              <p className="mt-2 max-w-2xl text-lg text-slate-300 [text-shadow:0_1px_8px_rgba(0,0,0,0,0.3)]">Your financial operating system.</p>
            </div>
            { isPremium &&
              <button className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-semibold bg-white/10 text-slate-200 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>
                  Invite Members
              </button>
            }
          </div>

          <div className="mt-8 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-6">
              {boards.map(board => {
                const isActive = activeBoard === board.id;
                const isDisabled = board.isPremium && !isPremium;
                return (
                  <button
                    key={board.id}
                    disabled={isDisabled}
                    onClick={() => isDisabled ? upgradeToPremium() : setActiveBoard(board.id)}
                    className={`flex items-center gap-2 px-3 py-3 text-sm font-semibold border-b-2 transition-all ${
                      isActive ? 'border-tech-blue text-white' : 'border-transparent text-slate-400 hover:text-white'
                    } ${isDisabled ? 'cursor-not-allowed' : ''}`}
                    title={isDisabled ? 'Upgrade to Premium to unlock' : ''}
                  >
                    {board.label}
                    {isDisabled && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
                  </button>
                );
              })}
               <button onClick={upgradeToPremium} className="flex items-center gap-2 px-3 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-white transition-all ml-4" title="Upgrade to create custom boards">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                New Board
                {!isPremium && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            {activeBoard === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Feed */}
                    <div className="lg:col-span-8 space-y-6">
                      {feedItems.map(item => (
                        <FeedItemCard key={item.id} item={item} onUpgrade={upgradeToPremium} />
                      ))}
                    </div>
                    {/* Sidebar with Widgets */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Financial Overview Widget */}
                        <div className="bg-slate-800/50 backdrop-blur-lg border border-white/20 shadow-soft p-6 rounded-2xl">
                            <h3 className="font-display text-lg font-semibold text-white mb-4">Financial Overview</h3>
                            <div className="space-y-4">
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <p className="text-sm text-slate-400">Total Monthly Bills</p>
                                    <p className="font-display text-3xl font-bold mt-1 bg-gradient-to-r from-tech-blue to-emerald-save text-transparent bg-clip-text">£{trackedBills.reduce((acc, b) => acc + b.monthlyCost, 0).toFixed(2)}</p>
                                </div>
                                <div className="bg-emerald-500/10 p-4 rounded-xl">
                                    <p className="text-sm text-emerald-300">Potential Annual Savings</p>
                                    <p className="font-display text-3xl font-bold text-emerald-400 mt-1">£{(trackedBills.reduce((acc, b) => acc + b.monthlyCost, 0) * 0.15 * 12).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                         {/* Integrations Widget */}
                        <div className="bg-slate-800/50 backdrop-blur-lg border border-white/20 shadow-soft p-6 rounded-2xl">
                            <h3 className="font-display text-lg font-semibold text-white mb-4">Connect Your Accounts</h3>
                             <p className="text-slate-300 text-sm mb-4">Enable automated tracking by connecting your providers.</p>
                            <div className="space-y-3">
                                {integrations.map(int => (
                                    <button key={int.name} onClick={() => handleOpenIntegrationModal(int)} className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left group">
                                        <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
                                            <img src={`https://logo.clearbit.com/${int.domain}`} alt={int.name} className="w-full h-full object-contain rounded-sm transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                        <span className="font-semibold text-slate-200">{int.name}</span>
                                        <span className="ml-auto text-sm text-tech-blue font-semibold">Connect</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeBoard === 'bills' && <KanbanBoard bills={trackedBills} onEditBill={handleEditBillClick} onAddBill={handleAddBillClick} />}
            {activeBoard === 'savings' && <SavingsGoalsBoard goals={savingsGoals} onAddGoal={addSavingsGoal} />}
          </div>
        </div>
      </section>
      <BillManagementModal 
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onSave={handleSaveBill}
        billToEdit={billToEdit}
      />
      <IntegrationModal
        isOpen={integrationModalState.isOpen}
        integration={integrationModalState.integration}
        onClose={() => setIntegrationModalState({ isOpen: false, integration: null })}
        onConnectSuccess={addBill}
      />
    </>
  );
};

export default DashboardPage;