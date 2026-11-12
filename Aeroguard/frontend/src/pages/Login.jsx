import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CloudRain, User, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [isSignup, setIsSignup] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        await axios.post('/api/signup', { name, email: username, password });
        setSuccess('Account created successfully! Please sign in.');
        setIsSignup(false);
        setPassword('');
      } else {
        const res = await axios.post('/api/login', {
          username,
          password,
          role: activeTab
        });
        setUser(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md glass-sky-card rounded-3xl p-8 shadow-xl shadow-sky-200/50 relative overflow-hidden">
        
        {/* Top Sky Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-300" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-sky-500 to-sky-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-sky-300/60 mb-3">
            <CloudRain className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-sky-900">
            {isSignup ? 'Create Account' : activeTab === 'admin' ? 'Admin Portal' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-sky-600 font-medium mt-1">
            {isSignup
              ? 'Join AeroGuard ML to monitor real-time weather anomalies.'
              : activeTab === 'admin'
              ? 'Secure authentication for designated system administrators.'
              : 'Sign in to access your flight safety dashboard.'}
          </p>
        </div>

        {/* Dual Tab Switcher (User vs Admin) */}
        {!isSignup && (
          <div className="flex bg-sky-100/70 p-1 rounded-2xl mb-6 border border-sky-200/80">
            <button
              type="button"
              onClick={() => { setActiveTab('user'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'user'
                  ? 'bg-white text-sky-600 shadow-md shadow-sky-200/50'
                  : 'text-sky-700 hover:text-sky-900'
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-300/50'
                  : 'text-sky-700 hover:text-sky-900'
              }`}
            >
              ⚡ Admin Login
            </button>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-sky-800 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-sky-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-sky-input pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-sky-800 mb-1">
              {activeTab === 'admin' ? 'Admin Login ID or Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-sky-400" />
              <input
                type="text"
                required
                placeholder={activeTab === 'admin' ? 'PrasannaAdmin' : 'name@ksrce.ac.in'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full glass-sky-input pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-800 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-sky-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-sky-input pl-10 pr-10 py-2.5 rounded-2xl text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-2.5 text-sky-400 hover:text-sky-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin' && !isSignup
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-200'
                : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-sky-300'
            }`}
          >
            {loading ? 'Authenticating...' : isSignup ? 'Create Account' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Signup / Login Toggle */}
        <div className="mt-6 text-center border-t border-sky-100 pt-4">
          <button
            onClick={() => { setIsSignup(!isSignup); setError(''); setSuccess(''); }}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>

      </div>
    </div>
  );
}
