
import React, { useState, useEffect } from 'react';
import { Category, KanbanStatus, TrackedBill } from '../types';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: { name: string; domain: string; category: Category } | null;
  onConnectSuccess: (bill: Omit<TrackedBill, 'id'>) => Promise<void>;
}

type Step = 'consent' | 'connecting' | 'analyzing' | 'success' | 'error';

const IntegrationModal: React.FC<IntegrationModalProps> = ({ isOpen, onClose, integration, onConnectSuccess }) => {
  const [step, setStep] = useState<Step>('consent');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('consent');
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConsent = async () => {
    setStep('connecting');
    await new Promise(res => setTimeout(res, 2000));
    
    setStep('analyzing');
    await new Promise(res => setTimeout(res, 2000));
    
    try {
        const today = new Date();
        const dueDate = new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString().split('T')[0];

        const newBill: Omit<TrackedBill, 'id'> = {
            category: integration?.category || Category.Other,
            provider: integration?.name || 'Unknown Provider',
            name: 'Automated Plan',
            monthlyCost: parseFloat((Math.random() * 50 + 25).toFixed(2)),
            source: integration?.name || 'Unknown',
            dueDate: dueDate,
            status: KanbanStatus.Upcoming,
        };
        await onConnectSuccess(newBill);
        setStep('success');
        
        setTimeout(() => handleClose(), 1500);
    } catch(e) {
        setStep('error');
    }
  };

  if (!isOpen || !integration) return null;
  
  const renderContent = () => {
    switch (step) {
      case 'consent':
        return (
          <>
            <h2 className="font-display text-2xl font-bold text-navy-heading">Connect to {integration.name}</h2>
            <p className="text-slate-body mt-2">
              By continuing, you agree to securely share your account data with Price Compass.
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConsent}
                className="btn-gradient px-5 py-2.5 text-white rounded-full text-sm font-semibold"
              >
                Agree & Connect
              </button>
            </div>
          </>
        );
      default:
        const messages: Record<Step, { icon: React.ReactNode; title: string; subtitle: string; }> = {
            connecting: {
                icon: <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-blue"></div>,
                title: `Connecting...`,
                subtitle: `Redirecting to ${integration.name}.`
            },
            analyzing: {
                icon: <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-save"></div>,
                title: 'Analyzing Accounts...',
                subtitle: `We're finding your latest bills.`
            },
            success: {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
                title: 'Connection Successful!',
                subtitle: 'Your account is now linked.'
            },
            error: {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
                title: 'Connection Failed',
                subtitle: 'Something went wrong. Please try again.'
            },
            consent: { icon: null, title: '', subtitle: '' }
        };
        const currentMessage = messages[step];
        const bgColor = step === 'success' ? 'bg-emerald-save/20 text-emerald-save' : step === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-slate-100';
        
        return (
            <div className="flex flex-col items-center">
                <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-4`}>
                    {currentMessage.icon}
                </div>
                <h2 className="font-display text-2xl font-bold text-navy-heading">{currentMessage.title}</h2>
                <p className="text-slate-body mt-2 text-center">{currentMessage.subtitle}</p>
            </div>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'modal-backdrop-out' : 'modal-backdrop-in'}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 w-full max-w-lg m-4 text-left border border-white/20 transition-all duration-300 ease-in-out ${isClosing ? 'modal-content-out' : 'modal-content-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-6" style={{ opacity: step === 'consent' ? 1 : 0.5, transition: 'opacity 0.3s' }}>
            <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center border border-slate-200/80 shadow-inner">
                <img src={`https://logo.clearbit.com/compass.com`} alt="Price Compass" className="max-h-8 w-auto object-contain rounded-md" />
            </div>
            <div className="flex-grow h-px bg-slate-300"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="flex-grow h-px bg-slate-300"></div>
            <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center border border-slate-200/80 shadow-inner">
                <img src={`https://logo.clearbit.com/${integration.domain}`} alt={integration.name} className="max-h-8 w-auto object-contain rounded-md" />
            </div>
        </div>
        
        <div className="min-h-[120px] flex flex-col justify-center">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default IntegrationModal;
