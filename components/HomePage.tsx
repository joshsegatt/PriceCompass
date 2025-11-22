

import React, { useRef, useEffect, useState } from 'react';
// FIX: The 'Page' type is exported from '../types' not '../App'.
import type { Page } from '../types';

interface HomePageProps {
  navigate: (page: Page) => void;
}

const StreamItem: React.FC<{ logo: string; provider: string; price: string; tag?: { text: string; color: 'green' | 'blue' } }> = ({ logo, provider, price, tag }) => (
  <div className="stream-item">
    <img src={`https://logo.clearbit.com/${logo}`} alt={provider} />
    <div>
      <div className="provider">{provider}</div>
      <div className="price">{price}</div>
    </div>
    {tag && <div className={`tag ml-auto ${tag.color === 'green' ? 'tag-green' : 'tag-blue'}`}>{tag.text}</div>}
  </div>
);

// FIX: Define a type for stream data to ensure `tag.color` is correctly typed.
type StreamItemData = {
  logo: string;
  provider: string;
  price: string;
  tag?: {
    text: string;
    color: 'green' | 'blue';
  };
};

const streamData: StreamItemData[] = [
  { logo: 'bt.com', provider: 'BT Fibre', price: 'Now £29.99', tag: { text: '-15%', color: 'green' } },
  { logo: 'octopus.energy', provider: 'Octopus Energy', price: 'Avg. £148/mo' },
  { logo: 'aviva.co.uk', provider: 'Aviva Car Ins.', price: 'Save up to £110', tag: { text: 'Best Value', color: 'blue' } },
  { logo: 'ee.co.uk', provider: 'EE Mobile', price: '150GB for £25' },
  { logo: 'sky.com', provider: 'Sky Broadband', price: 'From £26/mo' },
  { logo: 'ovoenergy.com', provider: 'OVO Energy', price: '100% Green Energy' },
  { logo: 'directline.com', provider: 'Direct Line', price: 'Quote in 2 mins', tag: { text: 'Popular', color: 'blue' } },
  { logo: 'three.co.uk', provider: 'Three Mobile', price: 'Unlimited Data £20', tag: { text: '-20%', color: 'green' } },
];

const dashboardBillData = [
  { logo: 'octopus.energy', provider: 'Octopus Energy', cost: 152.70 },
  { logo: 'bt.com', provider: 'BT Fibre', cost: 35.99 },
  { logo: 'aviva.co.uk', provider: 'Aviva Insurance', cost: 45.20 },
  { logo: 'ee.co.uk', provider: 'EE Mobile', cost: 25.00 },
  { logo: 'netflix.com', provider: 'Netflix', cost: 10.99 },
  { logo: 'spotify.com', provider: 'Spotify', cost: 9.99 },
  { logo: 'amazon.co.uk', provider: 'Amazon Prime', cost: 8.99 },
  { logo: 'virginmedia.com', provider: 'Virgin Media', cost: 55.00 },
];

const savingsOpportunitiesData = [
    { logo: 'eonnext.com', provider: 'E.ON Next', saving: 18.50 },
    { logo: 'shellenergy.co.uk', provider: 'Shell Energy', saving: 22.10 },
    { logo: 'britishgas.co.uk', provider: 'British Gas', saving: 15.75 },
    { logo: 'scottishpower.co.uk', provider: 'Scottish Power', saving: 25.30 },
];


const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
    
  const heroRef = useRef<HTMLElement>(null);
  const dashboardPanelRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const [dynamicValues, setDynamicValues] = useState({
    balance: 1829.45,
    savings: 284.15,
    balancePulse: false,
    savingsPulse: false,
  });
  
  const [currentSavingIndex, setCurrentSavingIndex] = useState(0);

  // Animate values for showcase
  useEffect(() => {
    const valueInterval = setInterval(() => {
      setDynamicValues(prev => ({
        ...prev,
        balance: prev.balance + (Math.random() - 0.5) * 15,
        savings: prev.savings + (Math.random() - 0.5) * 5,
        balancePulse: true,
        savingsPulse: true,
      }));
      setTimeout(() => setDynamicValues(prev => ({ ...prev, balancePulse: false, savingsPulse: false })), 400);
    }, 2500);
    
    const savingsInterval = setInterval(() => {
        setCurrentSavingIndex(prev => (prev + 1) % savingsOpportunitiesData.length);
    }, 4000);

    return () => {
        clearInterval(valueInterval);
        clearInterval(savingsInterval);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth) * 2 - 1; // -1 to 1
      const y = (clientY / innerHeight) * 2 - 1; // -1 to 1

      heroRef.current.style.setProperty('--mouse-x', x.toFixed(3));
      heroRef.current.style.setProperty('--mouse-y', y.toFixed(3));
    };

    const handleScroll = () => {
        if (!showcaseRef.current || !dashboardPanelRef.current) return;

        const { top, height } = showcaseRef.current.getBoundingClientRect();
        const screenHeight = window.innerHeight;

        if (top < screenHeight && top > -height) {
            const progress = (screenHeight - top) / (screenHeight + height);
            const rotationX = 25 - (progress * 30); 
            dashboardPanelRef.current.style.transform = `rotateX(${rotationX.toFixed(2)}deg)`;
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-cinematic w-full">
        {/* --- TOP HERO CONTENT --- */}
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[90vh] py-24 md:py-32 lg:py-40">
                <div className="text-center lg:text-left">
                    <h1 
                        className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tighter leading-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.3)] animate-fade-in-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        Stop overpaying. <br />
                        Start saving.
                    </h1>
                    <p 
                        className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-slate-300 leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.3)] animate-fade-in-up"
                        style={{ animationDelay: '0.4s' }}
                    >
                        Clarity in the chaos. We analyze the market, you reap the rewards. Find your perfect plan in seconds.
                    </p>
                    <div 
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up"
                        style={{ animationDelay: '0.6s' }}
                    >
                        <button 
                            onClick={() => navigate('catalogue')} 
                            className="btn-gradient w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-full text-white"
                        >
                            Start Comparing Now
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center h-full absolute top-0 right-0 w-1/2">
                    <div className="hero-3d-scene w-full h-full">
                        <div className="stream-wrapper">
                            {[...Array(4)].map((_, colIndex) => (
                                <div 
                                    key={colIndex}
                                    className="stream-column" 
                                    style={{ 
                                        left: `${colIndex * 30}%`, 
                                        animationDuration: `${30 + colIndex * 10}s`,
                                        animationDirection: colIndex % 2 === 0 ? 'normal' : 'reverse',
                                        top: `${-50 - (colIndex % 2) * 20}%`
                                    }}
                                >
                                    {[...streamData, ...streamData].map((item, index) => <StreamItem key={`${colIndex}-${index}`} {...item} />)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- DASHBOARD SHOWCASE CONTENT --- */}
        <div ref={showcaseRef} className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-40">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tighter [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">
                    Go Beyond Comparison. Take Control.
                </h2>
                <p className="mt-4 text-lg text-slate-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
                    Welcome to Compass Control, your intelligent financial co-pilot. Connect your accounts, visualize your spending in real-time, and let us automatically find savings you never knew existed. This is total financial clarity, made beautiful.
                </p>
                <div className="mt-8">
                    <button 
                        onClick={() => navigate('dashboard')} 
                        className="btn-gradient px-8 py-3.5 text-base font-semibold rounded-full text-white"
                    >
                        Explore Your Dashboard
                    </button>
                </div>
            </div>

            {/* Deconstructed 3D Dashboard Visualization */}
            <div className="mt-24 dashboard-deconstructed-scene">
                <div ref={dashboardPanelRef} className="dashboard-deconstructed-panel">
                    
                    {/* Widget 1: Financial Overview */}
                    <div 
                        className="widget-float" 
                        style={{ '--transform-start': 'translateZ(80px) translateY(-5px)', '--transform-end': 'translateZ(80px) translateY(5px)', width: '450px', height: '250px', top: '0', left: '0px', animationDelay: '-3s' } as React.CSSProperties}
                    >
                        <h3 className="text-sm font-semibold text-slate-300 mb-3">Financial Overview</h3>
                        <div className="flex items-baseline">
                            <p className={`font-display text-4xl font-bold text-white ${dynamicValues.balancePulse ? 'animate-value-update' : ''}`}>£{dynamicValues.balance.toFixed(2)}</p>
                            <p className="text-sm text-slate-400 ml-2">/ year</p>
                        </div>
                         <p className={`text-sm text-emerald-400 font-semibold ${dynamicValues.savingsPulse ? 'animate-value-update' : ''}`}>+£{dynamicValues.savings.toFixed(2)} potential savings</p>
                        <svg className="absolute bottom-4 left-4 right-4 w-auto h-24" fill="none" viewBox="0 0 300 100">
                            <path className="chart-line" d="M0 90 C 50 20, 100 95, 150 50, 200 10, 250 70, 300 30" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="3" strokeLinecap="round"/>
                            <circle cx="50" cy="20" r="4" fill="#10B981" className="graph-point" style={{animationDelay: '0s'}} />
                            <circle cx="150" cy="50" r="4" fill="#10B981" className="graph-point" style={{animationDelay: '0.5s'}} />
                            <circle cx="200" cy="10" r="4" fill="#10B981" className="graph-point" style={{animationDelay: '1s'}} />
                            <circle cx="300" cy="30" r="4" fill="#10B981" className="graph-point" style={{animationDelay: '1.5s'}} />
                        </svg>
                    </div>

                    {/* Widget 2: Tracked Bills */}
                    <div 
                        className="widget-float" 
                        style={{ '--transform-start': 'translateZ(40px) translateY(-10px)', '--transform-end': 'translateZ(40px) translateY(10px)', width: '400px', height: '300px', top: '250px', left: '80px' } as React.CSSProperties}
                    >
                        <h3 className="text-sm font-semibold text-slate-300 mb-3">My Tracked Bills</h3>
                        <div className="bill-scroll-wrapper">
                            <div className="bill-scroll-inner">
                                {[...dashboardBillData, ...dashboardBillData].map((bill, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg mb-2 bg-white/5">
                                        <img src={`https://logo.clearbit.com/${bill.logo}`} alt={bill.provider} className="w-8 h-8 rounded-md bg-white p-1" />
                                        <span className="text-sm font-medium text-slate-200">{bill.provider}</span>
                                        <span className="ml-auto text-sm font-semibold text-white">£{bill.cost.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Premium Widgets (Split & Animated) */}
                    <div style={{ transformStyle: 'preserve-3d', position: 'absolute', top: '50px', right: '0px', width: '320px', height: '450px' }}>
                        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-lg rounded-2xl z-10 flex flex-col items-center justify-center p-4">
                            <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 shimmer-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                <div className="shimmer-effect"></div>
                            </div>
                            <p className="text-sm text-white font-semibold text-center">Unlock Savings Opportunities & Trends</p>
                        </div>

                        {/* Savings Opportunities Widget (Behind) */}
                        <div className="widget-float" style={{'--transform-start': 'translateZ(-20px) translateY(0px)', '--transform-end': 'translateZ(-20px) translateY(0px)', width: '100%', height: '180px', top: '0', animation: 'none' } as React.CSSProperties}>
                            <h3 className="text-sm font-semibold text-slate-300 mb-3">Savings Opportunities</h3>
                            <div className="relative h-24">
                                {savingsOpportunitiesData.map((item, index) => (
                                    <div key={item.provider} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 absolute w-full" style={{ animation: `savings-item-fade ${savingsOpportunitiesData.length * 4}s infinite`, animationDelay: `${index * 4}s` }}>
                                        <img src={`https://logo.clearbit.com/${item.logo}`} alt={item.provider} className="w-8 h-8 rounded-md bg-white p-1" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">{item.provider}</p>
                                            <p className="text-xs text-slate-400">Potential saving</p>
                                        </div>
                                        <span className="ml-auto text-sm font-semibold text-emerald-400">+£{item.saving.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Spending Trends Widget (Behind) */}
                        <div className="widget-float" style={{'--transform-start': 'translateZ(-50px) translateY(0px)', '--transform-end': 'translateZ(-50px) translateY(0px)', width: '100%', height: '250px', top: '200px', animation: 'none' } as React.CSSProperties}>
                            <h3 className="text-sm font-semibold text-slate-300 mb-3">Spending Trends</h3>
                            <div className="flex items-end justify-between h-32 px-2">
                                {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.6].map((h, i) => (
                                    <div key={i} className="w-6 bg-white/10 rounded-t-sm" style={{ height: '100%', transformOrigin: 'bottom', animation: `trend-bar-grow 2s infinite alternate ease-in-out`, animationDelay: `${i * 0.2}s`, transform: `scaleY(${h})` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default HomePage;