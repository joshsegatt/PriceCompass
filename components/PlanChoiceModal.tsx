
import React from 'react';

interface PlanChoiceModalProps {
    onContinueFree: () => void;
    onUpgrade: () => void;
}

const PlanChoiceModal: React.FC<PlanChoiceModalProps> = ({ onContinueFree, onUpgrade }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop-in">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 w-full max-w-lg m-4 text-center border border-white/20 modal-content-in">
        <div className="w-16 h-16 bg-tech-blue/20 text-tech-blue rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-navy-heading">Your Full-Access Trial Has Ended</h2>
        <p className="text-slate-body mt-2 max-w-md mx-auto">
          You've had 2 days to explore all premium features. Choose how you want to proceed.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free Plan Option */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left">
            <h3 className="font-bold text-navy-heading">Continue with Free Plan</h3>
            <p className="text-sm text-slate-500 mt-1">Keep basic access to your dashboard.</p>
            <ul className="text-sm space-y-2 mt-4 text-slate-600">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span>Track up to <strong>3 bills</strong></span>
              </li>
               <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span>No automated savings alerts</span>
              </li>
            </ul>
             <button
              onClick={onContinueFree}
              className="mt-6 w-full px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"
            >
              Continue Free
            </button>
          </div>
          
          {/* Premium Plan Option */}
          <div className="bg-navy-dark border border-slate-700 rounded-xl p-6 text-left text-white relative overflow-hidden">
             <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2 2 0 00-2 2v1.944a2 2 0 01-.412 1.255L4.29 9.586A2 2 0 004 11v3a2 2 0 002 2h8a2 2 0 002-2v-3a2 2 0 00-.29-.986l-3.298-2.387A2 2 0 0112 5.944V4a2 2 0 00-2-2z" /><path d="M3 16a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1z" /></svg>
            </div>
            <h3 className="font-bold">Upgrade to Premium</h3>
            <p className="text-sm text-slate-400 mt-1">Keep all features & save your data.</p>
             <ul className="text-sm space-y-2 mt-4 text-slate-300">
               <li className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 <span><strong>Unlimited</strong> bill tracking</span>
               </li>
                <li className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 <span>Automated savings alerts</span>
               </li>
             </ul>
            <button
              onClick={onUpgrade}
              className="mt-6 w-full btn-gradient text-white rounded-full py-2.5 text-sm font-semibold"
            >
              Upgrade & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanChoiceModal;
