
import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (email: string, password: string) => Promise<boolean>;
  onSocialLogin: (provider: 'google') => void;
  initialView?: 'login' | 'register';
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister, onSocialLogin, initialView = 'login' }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoginView(initialView === 'login');
    setError('');
  }, [initialView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    let success = false;
    try {
        if (isLoginView) {
            success = await onLogin(email, password);
        } else {
            success = await onRegister(email, password);
        }
        if (!success) {
           setError(isLoginView ? 'Invalid credentials' : 'Registration failed');
        }
    } catch (e) {
        setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="hero-cinematic w-full relative min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-soft p-8 md:p-10">
          <div className="text-center">
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tighter">
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="mt-2 text-slate-300">
              {isLoginView ? 'Sign in to access your dashboard.' : 'Get started with your personal finance dashboard.'}
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => onSocialLogin('google')}
              disabled={isLoading}
              type="button"
              className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-white/20 bg-white/10 rounded-lg text-sm font-semibold text-slate-200 hover:bg-white/20 transition-colors disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                  c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                  c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                  C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                  c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574
                  l6.19,5.238C41.38,36.783,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or with email</span>
            </div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg text-center">{error}</p>}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-300 mb-1 block">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:ring-4 focus:ring-tech-blue/20 focus:border-tech-blue focus:outline-none transition-all duration-200 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-300 mb-1 block">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:ring-4 focus:ring-tech-blue/20 focus:border-tech-blue focus:outline-none transition-all duration-200 text-white placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient w-full text-white rounded-full py-3 font-semibold flex items-center justify-center"
            >
              {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>}
              {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => { setIsLoginView(!isLoginView); setError(''); }}
                className="font-semibold text-tech-blue hover:underline ml-1"
                disabled={isLoading}
              >
                {isLoginView ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
