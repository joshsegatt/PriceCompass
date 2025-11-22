
import React from 'react';
import type { Product, ProductFeature, ToggleCompareFn } from '../types';

interface ProductCardProps {
  product: Product;
  onEmailQuote: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  isInCompareList: boolean;
  onToggleCompare: ToggleCompareFn;
  isCompareFull: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const FeatureItem: React.FC<{ feature: ProductFeature }> = ({ feature }) => (
  <div className={`text-center px-2 py-2 rounded-lg ${feature.highlight ? 'bg-tech-blue/20' : 'bg-white/5'}`}>
    <p className="text-xs text-slate-400 capitalize">{feature.label}</p>
    <p className={`font-semibold text-sm ${feature.highlight ? 'text-tech-blue' : 'text-slate-100'}`}>{feature.value}</p>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, onEmailQuote, isFavorite, onToggleFavorite, isInCompareList, onToggleCompare, isCompareFull, className, style }) => {
  
  const handleCompareClick = () => {
    if (isCompareFull && !isInCompareList) return;
    onToggleCompare(product);
  };

  const compareTooltip = isCompareFull && !isInCompareList
    ? 'Compare list is full (max 3)'
    : isInCompareList
    ? 'Remove from compare'
    : 'Add to compare';

  const hasHighlight = product.promotion && product.tags && (product.tags.includes('Popular') || product.tags.includes('Best Value'));

  const cardClasses = [
    "group",
    "bg-slate-800/50 backdrop-blur-lg", // Dark glassmorphism background
    "rounded-3xl p-7 flex flex-col h-full transition-all duration-300 relative overflow-hidden",
    "border",
    isInCompareList
      ? 'border-2 border-tech-blue shadow-xl -translate-y-1.5'
      : 'border-white/20 shadow-soft hover:shadow-luxe hover:-translate-y-1.5',
    isCompareFull && !isInCompareList && "opacity-60 cursor-not-allowed hover:transform-none hover:shadow-soft",
    className,
  ].filter(Boolean).join(' ');


  return (
    <div className={cardClasses} style={style}>
        {hasHighlight ? (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-tech-blue to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>HIGHLIGHT</span>
          </div>
        ) : (
          product.tags && product.tags.length > 0 && (
            <div className="absolute top-0 left-0 bg-emerald-save text-white text-xs font-bold px-4 py-1 rounded-br-lg z-10">
              {product.tags[0].toUpperCase()}
            </div>
          )
        )}
        
        <div className="absolute top-4 right-4 z-10 flex items-center bg-black/20 backdrop-blur-sm rounded-full p-1 space-x-1 border border-white/10">
          <button
            onClick={handleCompareClick}
            title={compareTooltip}
            disabled={isCompareFull && !isInCompareList}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${isInCompareList
                ? 'bg-tech-blue text-white'
                : 'text-white hover:bg-white/20'
              }
              ${isCompareFull && !isInCompareList
                ? 'cursor-not-allowed'
                : 'cursor-pointer'
              }
            `}
          >
            {isInCompareList ? (
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
          
          <button
              onClick={() => onToggleFavorite(product.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-white hover:bg-white/20"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-300'}`} viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
          </button>
        </div>
        
        <div className="text-center">
            <div className="flex items-center justify-center h-20 mb-4 group">
                <div className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center shadow-inner border border-slate-100">
                    <img 
                        src={product.logoUrl} 
                        alt={`${product.provider} logo`} 
                        className="max-h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
                    />
                </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              <h3 className="font-display text-xl font-bold text-white leading-tight">{product.provider}</h3>
              {product.promotion && (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                  Discount
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 mt-1">{product.planName}</p>
        </div>
        
        <div className="my-5 bg-white/5 rounded-xl p-4 text-center">
            <span className="font-display text-4xl font-extrabold bg-gradient-to-r from-tech-blue to-emerald-save text-transparent bg-clip-text tracking-tighter leading-none">£{product.price.toFixed(2)}</span>
            <span className="text-slate-400 ml-1.5 font-medium">/month</span>
        </div>
        
        {product.promotion && (
             <div className="text-center text-xs font-bold text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg">
                {product.promotion}
            </div>
        )}

        <div className="flex-grow"></div>

        <div className="space-y-5 pt-6 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2">
                {product.features.map((feature, index) => (
                    <FeatureItem key={index} feature={feature} />
                ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
                 <a 
                  href={product.dealUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gradient block text-center w-full text-white rounded-full py-3 font-semibold"
                >
                    See Deal
                </a>
                <button 
                    onClick={() => onEmailQuote(product)}
                    title="Email Quote"
                    aria-label="Email Quote"
                    className="flex-shrink-0 w-11 h-11 bg-white/10 text-slate-300 rounded-full flex items-center justify-center hover:bg-white/20 hover:text-white transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;
