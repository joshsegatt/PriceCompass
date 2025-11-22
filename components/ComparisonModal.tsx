
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';

interface ComparisonModalProps {
  products: Product[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ products, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const allFeatureLabels = React.useMemo(() => {
    const featureSet = new Set<string>();
    products.forEach(product => {
      product.features.forEach(feature => {
        featureSet.add(feature.label);
      });
    });
    return Array.from(featureSet);
  }, [products]);
  
  const getFeatureValue = (product: Product, label: string): string => {
    const feature = product.features.find(f => f.label === label);
    return feature ? feature.value : '–';
  };

  const lowestPrice = React.useMemo(() => {
    if (!products || products.length === 0) return null;
    return Math.min(...products.map(p => p.price));
  }, [products]);

  const highestPrice = React.useMemo(() => {
    if (!products || products.length < 2) return null;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isClosing ? 'modal-backdrop-out' : 'modal-backdrop-in'}`}
      onClick={handleClose}
    >
      <div
        className={`relative hero-cinematic rounded-2xl shadow-lg w-full max-w-6xl h-[90vh] text-left border border-white/20 flex flex-col ${isClosing ? 'modal-content-out' : 'modal-content-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 p-6 border-b border-white/20 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Compare Plans</h2>
            <button onClick={handleClose} className="text-slate-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="flex-grow overflow-auto">
          <div className="flex p-6 min-w-max">
            <div className="flex flex-col flex-shrink-0 w-44 sticky left-0 z-10">
              <div className="h-44 flex items-end pb-4 font-semibold text-slate-400"><span className="pl-4">Provider</span></div>
              <div className="h-48 flex items-center font-semibold text-white">
                <span className="pl-4">Price</span>
              </div>
              {allFeatureLabels.map((label) => (
                <div key={label} className="h-24 flex items-center font-semibold text-white border-t border-white/10">
                  <span className="pl-4">{label}</span>
                </div>
              ))}
              <div className="h-24 flex-grow border-t border-white/10"></div>
            </div>

            <div className="flex gap-4">
              {products.map((product) => {
                const isLowestPrice = product.price === lowestPrice;
                const savings = highestPrice ? highestPrice - product.price : 0;
                const barWidth = highestPrice && savings > 0 ? (savings / highestPrice) * 100 : 0;
                const badgeTag = product.tags?.find(t => t === 'Best Value' || t === 'Popular');
                
                const cardClasses = [
                  'w-64', 'rounded-2xl', 'transition-all', 'duration-300', 'hover:-translate-y-1', 'relative', 'group',
                  'bg-slate-800/50 backdrop-blur-lg',
                  'border',
                  isLowestPrice
                    ? 'border-emerald-save border-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)]'
                    : 'border-white/20 shadow-soft hover:shadow-luxe'
                ].join(' ');

                const textColor = 'text-white';
                const subTextColor = 'text-slate-300';
                const borderColor = 'border-white/10';

                return (
                  <div key={product.id} className={cardClasses}>
                      {badgeTag && (
                           <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full z-20 flex items-center gap-1.5 shadow-lg bg-gradient-to-r from-tech-blue to-blue-600 text-white`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              <span>{badgeTag.toUpperCase()}</span>
                           </div>
                      )}
                      
                      <div className="w-full h-full flex flex-col rounded-[15px]">
                          <div className="h-44 text-center p-4 flex flex-col justify-center items-center">
                            <div className="w-20 h-20 mx-auto bg-white rounded-2xl p-2 flex items-center justify-center shadow-inner border border-slate-100">
                                <img 
                                  src={product.logoUrl} 
                                  alt={`${product.provider} logo`} 
                                  className="max-h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
                                />
                            </div>
                            <h3 className={`font-bold leading-tight mt-4 ${textColor}`}>{product.provider}</h3>
                            <p className={`text-sm ${subTextColor}`}>{product.planName}</p>
                          </div>
                          
                          <div className={`h-48 text-center p-4 flex flex-col justify-center border-t ${borderColor}`}>
                            <div>
                              <p className="font-bold text-2xl bg-gradient-to-r from-tech-blue to-emerald-save text-transparent bg-clip-text">£{product.price.toFixed(2)}</p>
                              <p className={`text-sm ${subTextColor}`}>/month</p>
                            </div>
                            <div className="mt-3 text-left w-full h-[42px] flex flex-col justify-end">
                              {highestPrice && savings > 0 ? (
                                <div>
                                  <div className="flex justify-between items-center text-xs mb-1">
                                      <span className={subTextColor}>Savings</span>
                                      <span className="font-semibold text-emerald-save">
                                        - £{savings.toFixed(2)}
                                      </span>
                                  </div>
                                  <div className={`w-full rounded-full h-2 bg-white/10`}>
                                      <div
                                          className="rounded-full h-2 bg-emerald-save transition-all duration-500 ease-out"
                                          style={{ width: `${barWidth}%` }}
                                      ></div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {allFeatureLabels.map((label) => (
                            <div key={label} className={`h-24 text-center flex justify-center items-center p-2 border-t ${subTextColor} ${borderColor}`}>
                              {getFeatureValue(product, label)}
                            </div>
                          ))}
                          
                          <div className={`h-24 flex-grow p-4 mt-auto flex items-center border-t ${borderColor}`}>
                            <a 
                              href={product.dealUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block w-full text-center rounded-full py-2.5 font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5 
                              ${isLowestPrice 
                                ? 'bg-emerald-save text-white hover:bg-emerald-600' 
                                : 'btn-gradient text-white'
                              }`}
                            >
                                See Deal
                            </a>
                          </div>
                      </div>
                    </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
