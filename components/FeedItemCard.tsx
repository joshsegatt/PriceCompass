
import React from 'react';
import { FeedItem } from '../types';

interface FeedItemCardProps {
  item: FeedItem;
  onUpgrade: () => void;
}

const FeedItemCard: React.FC<FeedItemCardProps> = ({ item, onUpgrade }) => {
  const { icon, title, description, isPremiumLocked, ctaText } = item;

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-soft p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:bg-white/15 hover:-translate-y-1">
      {isPremiumLocked && (
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md rounded-2xl z-10 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-semibold text-white mb-1 text-center">{title}</p>
          <p className="text-sm text-slate-300 mb-4 text-center max-w-xs">{description}</p>
          <button onClick={onUpgrade} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-5 py-2 text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-px transition-all">
            Upgrade to Unlock
          </button>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-white/10 text-slate-300 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-300 mt-1">{description}</p>
          {ctaText && !isPremiumLocked && (
            <button className="mt-4 text-sm font-semibold text-tech-blue hover:underline">
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedItemCard;
