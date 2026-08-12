import React, { useState } from 'react';
import { useLogin, useRegister, useUsersList } from '../lib/api';
import type { UserProfile } from '../types';
import { X, LogIn, UserPlus, Sparkles, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserProfile) => void;
  currentUser?: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  currentUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'switch'>('switch');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const { data: usersList } = useUsersList();

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          onSelectUser(data.user);
          onClose();
        },
        onError: (err: any) => {
          setErrorMsg(err.message || 'Login failed. Please check your credentials.');
        },
      }
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    registerMutation.mutate(
      { name, email, phone, password, birthday },
      {
        onSuccess: (data) => {
          onSelectUser(data.user);
          onClose();
        },
        onError: (err: any) => {
          setErrorMsg(err.message || 'Registration failed. Email might already exist.');
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-xl my-8 text-slate-900"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              LoyaltyHub Access
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select demo role, sign in, or create a member account
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              onClick={() => {
                setAuthMode('switch');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMode === 'switch'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Demo Accounts
            </button>
            <button
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode 1: Quick Demo User Switching */}
          {authMode === 'switch' && (
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Role Accounts:
              </p>
              {usersList?.map((u) => {
                const isSelected = currentUser?.id === u.id;
                return (
                  <motion.div
                    key={u.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-50 border-slate-400 text-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                          <span
                            className={`px-2 py-0.2 text-[9px] font-bold uppercase rounded-md border ${
                              u.role === 'Admin'
                                ? 'bg-amber-100 text-amber-900 border-amber-200'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                            }`}
                          >
                            {u.role === 'Admin' ? 'ADMIN' : u.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          ID: {u.memberId} • {u.pointsBalance} PTS
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="p-1 bg-slate-900 text-white rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Mode 2: Sign In Form */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex.m@loyaltyhub.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{loginMutation.isPending ? 'Signing In...' : 'Sign In'}</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Demo: <span className="text-slate-600 font-mono">alex.m@loyaltyhub.io</span> / <span className="text-slate-600 font-mono">password123</span>
              </p>
            </form>
          )}

          {/* Mode 3: Register Form */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+66 81 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>🎁 200 Free Bonus Points credited on signup!</span>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{registerMutation.isPending ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
