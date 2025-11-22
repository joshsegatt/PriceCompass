import React, { useState, useEffect } from 'react';
import type { Product } from '../types';

interface EmailQuoteModalProps {
  product: Product | null;
  onClose: () => void;
}

const EmailQuoteModal: React.FC<EmailQuoteModalProps> = ({ product, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Reset state if product changes, indicating a new modal opening
    if (product) {
      setEmail('');
      setIsSending(false);
      setIsSent(false);
      setIsClosing(false);
    }
  }, [product]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Animation duration
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSending || isSent) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        handleClose();
      }, 2500); // Close modal after success message
    }, 1000); // Simulate 1s delay
  };

  if (!product) return null;

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'modal-backdrop-out' : 'modal-backdrop-in'}`}
        onClick={handleClose}
    >
      <div 
        className={`relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 w-full max-w-md m-4 text-center border border-white/20 ${isClosing ? 'modal-content-out' : 'modal-content-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!isSent ? (
          <>
            <img src={product.logoUrl} alt={`${product.provider} logo`} className="max-h-8 object-contain mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold text-navy-heading">Email Quote</h2>
            <p className="text-slate-body mt-2">Get the details for <span className="font-semibold text-navy-heading">{product.provider} - {product.planName}</span> sent to your inbox.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 text-left">
              <label htmlFor="email" className="text-sm font-medium text-slate-600 mb-2 block">Your email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 pl-11 bg-white border border-slate-300/70 rounded-lg focus:ring-4 focus:ring-tech-blue/10 focus:border-tech-blue focus:outline-none transition-all duration-200 placeholder-slate-400"
                />
              </div>
              <button 
                type="submit"
                disabled={isSending}
                className="btn-gradient w-full mt-5 text-white rounded-full py-3 font-semibold"
              >
                {isSending ? 'Sending...' : 'Send Quote'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 bg-emerald-save/20 text-emerald-save rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
             </div>
             <h2 className="font-display text-2xl font-bold text-navy-heading">Success!</h2>
             <p className="text-slate-body mt-2">
                Your quote has been sent to <br /> <span className="font-semibold text-navy-heading">{email}</span>.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailQuoteModal;