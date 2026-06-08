'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      // Successfully authenticated
      setMessage(isLogin ? 'Successfully logged in! Redirecting...' : 'Account created successfully! Redirecting...');
      
      setTimeout(() => {
        // Read redirect parameter if any
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/';
        window.location.href = redirect;
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FFF9] p-4 pt-28 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white border border-[#2E7D32]/10 rounded-2xl shadow-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-[#F9FFF9] border border-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32]">
              <Leaf className="w-6 h-6 fill-current" />
            </div>
          </div>
          <h1 className="text-3xl font-display text-[#1B5E20] font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs text-[#555555]">
            {isLogin ? 'Sign in to your account to continue checkout' : 'Join Dr. Nidan for organic health formulations'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-green-50 text-[#2E7D32] text-xs font-semibold rounded-lg border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Your Name *</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full px-4 py-2.5 bg-white text-[#1A1A1A] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Email Address *</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@gmail.com"
              className="w-full px-4 py-2.5 bg-white text-[#1A1A1A] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Password *</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-10 bg-white text-[#1A1A1A] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Confirm Password *</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white text-[#1A1A1A] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl font-semibold transition-all shadow-sm disabled:opacity-75 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setMessage(null);
            }}
            type="button"
            className="text-xs text-[#2E7D32] font-semibold hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
