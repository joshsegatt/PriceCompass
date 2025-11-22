
import React from 'react';

interface TrialExpiredModalProps {
    onNavigate: (initialView: 'login' | 'register') => void;
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ onNavigate }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-in">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 w-full max-w-md m-4 text-center border border-white/20 modal-content-in">
        <div className="w-16 h-16 bg-tech-blue/20 text-tech-blue rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-navy-heading">Your Trial Has Ended</h2>
        <p className="text-slate-body mt-2">
          Your 2-day guest session is over. Create a free account to save your tracked bills and continue using your dashboard.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="w-full px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            I already have an account
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="btn-gradient w-full text-white rounded-full py-2.5 text-sm font-semibold"
          >
            Create Account & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredModal;
