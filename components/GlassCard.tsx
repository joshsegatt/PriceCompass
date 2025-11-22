
import React from 'react';

const GlassCard: React.FC = () => {
    return (
        <div className="w-full max-w-md h-80 bg-white/30 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-white/20">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-apple-grey/80">Your Savings</p>
                    <p className="font-display text-3xl font-bold text-navy-heading mt-1">£284.15</p>
                    <p className="text-sm text-emerald-save font-semibold mt-1">+12.5% vs last year</p>
                </div>
                <div className="flex -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://logo.clearbit.com/bt.com" alt="BT"/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://logo.clearbit.com/octopus.energy" alt="Octopus"/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://logo.clearbit.com/ee.co.uk" alt="EE"/>
                </div>
            </div>

            {/* Fake Graph */}
            <div className="mt-6 h-40 flex items-end justify-between space-x-2">
                <div className="w-full h-[60%] bg-white/50 rounded-t-md animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-full h-[40%] bg-white/50 rounded-t-md animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-full h-[75%] bg-white/50 rounded-t-md animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-full h-[50%] bg-white/50 rounded-t-md animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-full h-[80%] bg-tech-blue/80 rounded-t-md animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="w-full h-[65%] bg-white/50 rounded-t-md animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-full h-[90%] bg-white/50 rounded-t-md animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-full h-[70%] bg-white/50 rounded-t-md animate-pulse" style={{animationDelay: '0.3s'}}></div>
            </div>
             <div className="border-t border-dashed border-white/30 mt-1"></div>
        </div>
    );
}

export default GlassCard;
