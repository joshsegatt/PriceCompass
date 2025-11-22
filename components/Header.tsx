import React from 'react';
import type { Page, User } from '../types';

interface HeaderProps {
  navigate: (page: Page) => void;
  currentPage: Page;
  favoritesCount: number;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ navigate, currentPage, favoritesCount, currentUser, onLogout }) => {
    const navLinkClasses = (page: Page) => 
    `text-base font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
      currentPage === page ? 'text-tech-blue' : 'text-slate-700 hover:text-tech-blue'
    }`;
    
    // FIX: Removed 'isGuest' logic and reference to 'guestSessionStartDate', as it does not exist on the User type
    // and the guest session functionality is not implemented elsewhere in the app.
    // The component now assumes that if a `currentUser` object exists, the user is fully logged in.

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-900/10">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('home')}>
             <svg className="w-8 h-8 text-navy-heading transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2.78 9.61L16 30L29.22 9.61L16 2Z" fill="url(#header-logo-gradient)" stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M16 30V17L2.78 9.61" stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M29.22 9.61L16 17" stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9.5 13.5L16 2L22.5 13.5L16 17L9.5 13.5Z" fill="#334155" fillOpacity="0.6"/>
                <defs>
                  <linearGradient id="header-logo-gradient" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981"/>
                    <stop offset="1" stopColor="#0071E3"/>
                  </linearGradient>
                </defs>
            </svg>
            <span className="font-display font-extrabold text-2xl text-navy-heading tracking-tighter">Price Compass</span>
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            <a onClick={() => navigate('catalogue')} className={navLinkClasses('catalogue')}>Compare</a>
            <a onClick={() => navigate('dashboard')} className={navLinkClasses('dashboard')}>
              Dashboard
              {currentUser && currentUser.isPremium && (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a2 2 0 00-2 2v1.944a2 2 0 01-.412 1.255L4.29 9.586A2 2 0 004 11v3a2 2 0 002 2h8a2 2 0 002-2v-3a2 2 0 00-.29-.986l-3.298-2.387A2 2 0 0112 5.944V4a2 2 0 00-2-2z" />
                    <path d="M3 16a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1z" />
                </svg>
              )}
            </a>
            <a onClick={() => navigate('about')} className={navLinkClasses('about')}>About</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('favorites')} 
              className={`relative text-slate-700 transition-colors ${currentPage === 'favorites' ? 'text-tech-blue' : 'hover:text-tech-blue'}`}
              aria-label="Favorites"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-tech-blue text-white text-xs font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
            {currentUser ? (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-700 hidden sm:block">{currentUser.email}</span>
                    <button onClick={onLogout} className="bg-slate-800 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors">
                        Logout
                    </button>
                </div>
            ) : (
                <button onClick={() => navigate('catalogue')} className="btn-gradient text-white rounded-full px-6 py-3 text-sm font-semibold">
                  Compare Now
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
