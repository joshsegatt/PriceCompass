
import React from 'react';
import { Page } from '../types';

interface FooterProps {
  navigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const productLinks = ['Broadband', 'Energy', 'Insurance', 'Mobile', 'Credit Cards'];

  return (
    <footer className="bg-gradient-to-br from-navy-dark to-slate-800 text-white">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 mb-6 md:mb-0">
            <div className="flex items-center space-x-3">
               <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L2.78 9.61L16 30L29.22 9.61L16 2Z" fill="url(#logo-gradient-footer)" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M16 30V17L2.78 9.61" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M29.22 9.61L16 17" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9.5 13.5L16 2L22.5 13.5L16 17L9.5 13.5Z" fill="white" fillOpacity="0.8"/>
                  <defs>
                    <linearGradient id="logo-gradient-footer" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#10B981"/>
                      <stop offset="1" stopColor="#0071E3"/>
                    </linearGradient>
                  </defs>
              </svg>
              <span className="font-display font-bold text-xl tracking-tighter">Price Compass</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Your guide to smarter spending in the UK.</p>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-slate-200 tracking-tight">Compare</h3>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link}>
                  <button onClick={() => navigate('catalogue')} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm text-left">{link}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-slate-200 tracking-tight">Company</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <button onClick={() => navigate('about')} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">About Us</button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</button>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
             <h3 className="font-display font-semibold text-slate-200 tracking-tight">Stay Ahead</h3>
              <p className="mt-3 text-sm text-slate-400">Get monthly insights on the best deals and market changes.</p>
              <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                <div className="relative flex items-center">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-slate-800 border border-slate-600 text-slate-300 rounded-full py-2.5 pl-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-tech-blue/50"
                  />
                  <button type="submit" className="absolute right-1.5 flex-shrink-0 w-8 h-8 bg-gradient-to-r from-tech-blue to-emerald-save rounded-full flex items-center justify-center text-white hover:brightness-110 hover:scale-105 transition-all duration-200" aria-label="Subscribe">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </form>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 order-2 sm:order-1 mt-4 sm:mt-0">&copy; {new Date().getFullYear()} Price Compass Ltd. All rights reserved.</p>
          <div className="flex space-x-6 order-1 sm:order-2">
            {/* Social links removed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;