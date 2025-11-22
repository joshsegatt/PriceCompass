
import React from 'react';

// A helper component for the journey and principles sections
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 backdrop-blur-lg border border-white/20 shadow-soft p-8 rounded-2xl h-full">
    <div className="relative w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-white/10 text-tech-blue">
      {icon}
    </div>
    <h3 className="font-display text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-300">{description}</p>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <>
      <section className="hero-cinematic w-full relative">
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32 space-y-24">
          
          {/* 1. "Our Promise" Section */}
          <div className="text-center">
            <p className="font-semibold text-tech-blue animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Our Promise</p>
            <h1 
              className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tighter mt-4 max-w-4xl mx-auto [text-shadow:0_2px_10px_rgba(0,0,0,0.3)] animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              Your financial co-pilot in a complex market.
            </h1>
            <p 
              className="prose prose-lg max-w-3xl mx-auto text-slate-300 mt-6 leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.3)] animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              The UK market for essential services is intentionally complex. Price Compass was founded to cut through the noise, offering a transparent, unbiased, and truly premium experience. We don't work for providers; we work for you.
            </p>
          </div>
          
          {/* 2. "Your Journey to Savings" Section */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tighter">Your Journey to Savings</h2>
                  <p className="mt-4 text-lg text-slate-300">A seamless path from confusion to clarity and control.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                  title="1. Compare"
                  description="Start with our impartial, whole-of-market comparison engine. See every deal, not just the sponsored ones."
                />
                <FeatureCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  title="2. Connect"
                  description="Bring your existing bills into your personal dashboard. Track spending automatically by connecting your accounts."
                />
                <FeatureCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16m-7-2h2" /></svg>}
                  title="3. Conquer"
                  description="Let Compass Control analyze the market for you. Get notified when a better deal appears and conquer your finances."
                />
              </div>
          </div>

          {/* 3. "Compass Control" Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-soft p-8 md:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tighter">Introducing Compass Control</h2>
                      <p className="mt-4 text-lg text-slate-300">
                          This is more than a dashboard; it's your financial command center. By connecting your accounts, you unlock a powerful co-pilot dedicated to finding you savings.
                      </p>
                      <ul className="mt-6 space-y-4">
                          <li className="flex items-start gap-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              <span><strong className="text-white">Automated Tracking:</strong> <span className="text-slate-300">Securely link your providers to automatically track bills and spending without lifting a finger.</span></span>
                          </li>
                          <li className="flex items-start gap-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              <span><strong className="text-white">Premium Opportunities:</strong> <span className="text-slate-300">Our system constantly scans the market against your bills. We alert you the moment a better deal appears, showing you exactly how much you can save.</span></span>
                          </li>
                      </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-8 text-center">
                      <p className="font-semibold text-slate-400">Potential Savings Found</p>
                      <p className="font-display text-6xl font-extrabold text-emerald-400 my-2">£312</p>
                      <p className="text-slate-400">per year on average for Premium users</p>
                  </div>
              </div>
          </div>
          
          {/* 4. "Our Unshakeable Principles" Section */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tighter">Our Unshakeable Principles</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-1.026.977-2.19.977-3.434 0-1.426-.387-2.748-1.05-3.886M12 11c0 3.517.935 6.764 2.505 9.571m-3.44-2.04l-.054-.09A13.916 13.916 0 018 11a4 4 0 118 0c0 1.017.07 2.019.203 3m2.118 6.844A21.88 21.88 0 0115.171 17m-3.839 1.132c-.645-1.026-.977-2.19-.977-3.434 0-1.426.387-2.748 1.05-3.886" /></svg>}
                  title="Absolute Independence"
                  description="We are 100% impartial. Our recommendations are based on data and what's best for you, not on commissions."
                />
                <FeatureCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  title="Radical Clarity"
                  description="No jargon, no fine print. We present information clearly and simply, so you can make confident decisions."
                />
                <FeatureCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  title="Security First"
                  description="Your data privacy is paramount. We use bank-level security to protect your information at every step."
                />
                <FeatureCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  title="Superior Design"
                  description="We believe powerful tools should also be beautiful. Enjoy a high-quality, intuitive experience on every click."
                />
              </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
