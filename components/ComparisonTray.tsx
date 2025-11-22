
import React from 'react';
import { Product, ToggleCompareFn } from '../types';

interface ComparisonTrayProps {
  products: Product[];
  onClear: () => void;
  onCompare: () => void;
  onRemove: ToggleCompareFn;
}

const ComparisonTray: React.FC<ComparisonTrayProps> = ({ products, onClear, onCompare, onRemove }) => {
  const isVisible = products.length > 0;
  const slots = Array.from({ length: 3 });

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-screen-md mx-auto p-2">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-luxe p-4 flex items-center justify-between border border-white/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {slots.map((_, index) => {
                const product = products[index];
                if (product) {
                  return (
                    <div key={product.id} className="relative group" title={`${product.provider} - ${product.planName}`}>
                      <div className="w-14 h-14 bg-white rounded-lg shadow-md flex items-center justify-center p-1 border border-gray-200">
                        <img src={product.logoUrl} alt={product.provider} className="max-w-full max-h-10 object-contain" />
                      </div>
                      <button
                        onClick={() => onRemove(product)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-700 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        aria-label={`Remove ${product.provider}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={`slot-${index}`} className="w-14 h-14 bg-slate-200/50 rounded-lg border-2 border-dashed border-slate-400/80 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {products.length > 0 && (
                <button
                onClick={onClear}
                className="text-sm font-semibold text-slate-body hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onCompare}
              disabled={products.length < 2}
              className="btn-gradient text-white rounded-full px-6 py-2.5 text-sm font-semibold"
            >
              Compare ({products.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTray;