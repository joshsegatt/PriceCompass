
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CataloguePage from './components/CataloguePage';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import FavoritesPage from './components/FavoritesPage';
import ComparisonTray from './components/ComparisonTray';
import ComparisonModal from './components/ComparisonModal';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import { Page, Product, TrackedBill, User, SavingsGoal } from './types';
import { api } from './services/apiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [loginInitialView, setLoginInitialView] = useState<'login' | 'register'>('login');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await api.checkSession();
        setCurrentUser(user);
      } catch (e) {
        // No active session, which is normal.
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Periodic data sync to simulate real-time updates
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(async () => {
        try {
          const updatedUser = await api.fetchUserData(currentUser.email);
          setCurrentUser(updatedUser); // Update state with fresh data
        } catch (e) {
          console.error("Failed to sync user data periodically", e);
        }
      }, 30000); // Sync every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentUser]);


  const handleRegister = async (email: string, password: string): Promise<boolean> => {
    try {
      const newUser = await api.register(email, password);
      setCurrentUser(newUser);
      navigate('dashboard');
      return true;
    } catch (e) {
      alert((e as Error).message);
      return false;
    }
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await api.login(email, password);
      setCurrentUser(user);
      navigate('dashboard');
      return true;
    } catch (e) {
      alert((e as Error).message);
      return false;
    }
  };
  
  const handleSocialLogin = async (socialProvider: 'google') => {
    try {
      const user = await api.socialLogin(socialProvider);
      setCurrentUser(user);
      navigate('dashboard');
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    navigate('home');
  };

  const updateUser = async (updatedUser: User) => {
      try {
        const savedUser = await api.updateUser(updatedUser);
        setCurrentUser(savedUser);
      } catch (e) {
        setError("Failed to save changes. Please try again.");
      }
  };
  
  const addBill = async (bill: Omit<TrackedBill, 'id'>) => {
    if (!currentUser) return;
    try {
        const newBill = await api.addBill(currentUser.email, bill);
        const updatedUser = { ...currentUser, trackedBills: [...currentUser.trackedBills, newBill] };
        setCurrentUser(updatedUser);
    } catch(e) {
        setError("Failed to add bill.");
    }
  };

  const updateBill = async (updatedBill: TrackedBill) => {
    if (!currentUser) return;
    try {
        const savedBill = await api.updateBill(currentUser.email, updatedBill);
        const updatedUser = { ...currentUser, trackedBills: currentUser.trackedBills.map(b => b.id === savedBill.id ? savedBill : b) };
        setCurrentUser(updatedUser);
    } catch(e) {
        setError("Failed to update bill.");
    }
  };

  const deleteBill = async (billId: string) => {
    if (!currentUser) return;
    try {
        await api.deleteBill(currentUser.email, billId);
        const updatedUser = { ...currentUser, trackedBills: currentUser.trackedBills.filter(b => b.id !== billId) };
        setCurrentUser(updatedUser);
    } catch(e) {
        setError("Failed to delete bill.");
    }
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
      if (!currentUser) return;
      try {
        const newGoal = await api.addSavingsGoal(currentUser.email, goal);
        const updatedUser = { ...currentUser, savingsGoals: [...(currentUser.savingsGoals || []), newGoal] };
        setCurrentUser(updatedUser);
      } catch(e) {
        setError("Failed to add savings goal.");
      }
  };

  const upgradeToPremium = async () => {
    if (!currentUser) {
        navigateToLogin('register');
        return;
    }
    try {
        const updatedUser = await api.upgradeToPremium(currentUser.email);
        setCurrentUser(updatedUser);
        alert("Congratulations! You've been upgraded to Premium.");
    } catch(e) {
        setError("Failed to upgrade to premium.");
    }
  };

  const navigate = (page: Page) => {
    if (page === 'dashboard' && !currentUser) {
        setCurrentPage('login');
    } else {
        setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };
  
  const navigateToLogin = (initialView: 'login' | 'register') => {
    setLoginInitialView(initialView);
    navigate('login');
  };

  const toggleFavorite = (productId: string) => { setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]); };
  const toggleCompare = (product: Product) => { setComparisonList(prev => prev.some(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : prev.length < 3 ? [...prev, product] : prev); };
  const clearCompare = () => { setComparisonList([]); };
  const openCompareModal = () => { if (comparisonList.length < 2) return; setIsCompareModalOpen(true); };
  const closeCompareModal = () => { setIsCompareModalOpen(false); };
  
  const commonPageProps = { favorites, toggleFavorite, comparisonList, toggleCompare };
  const dashboardPageProps = { 
      user: currentUser,
      addBill, updateBill, deleteBill, upgradeToPremium, addSavingsGoal
  };

  const renderPage = () => {
    if (isLoading) {
        return <div className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-tech-blue"></div></div>;
    }

    switch (currentPage) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'catalogue': return <CataloguePage {...commonPageProps} />;
      case 'about': return <AboutPage />;
      case 'favorites': return <FavoritesPage {...commonPageProps} />;
      case 'dashboard': return currentUser ? <DashboardPage {...dashboardPageProps} /> : <LoginPage onLogin={handleLogin} onRegister={handleRegister} onSocialLogin={handleSocialLogin} initialView={loginInitialView} />;
      case 'login': return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onSocialLogin={handleSocialLogin} initialView={loginInitialView} />;
      case 'privacy': return <PrivacyPolicyPage />;
      default: return <HomePage navigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-body bg-canvas">
      <Header navigate={navigate} currentPage={currentPage} favoritesCount={favorites.length} currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer navigate={navigate} />
      <ComparisonTray products={comparisonList} onClear={clearCompare} onCompare={openCompareModal} onRemove={toggleCompare} />
      {isCompareModalOpen && <ComparisonModal products={comparisonList} onClose={closeCompareModal} />}
    </div>
  );
};

export default App;