'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase is not configured');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.user.app_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        setErrorMsg('This account is not authorised for admin access.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Authentication service error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C5A880]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#141418] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] font-bold text-xl group-hover:border-[#C5A880] transition-colors shadow-[0_0_20px_rgba(197,168,128,0.15)]">
              AS
            </div>
            <div className="text-left">
              <div className="text-xl font-bold tracking-tight text-[#F5F2ED] font-['Outfit']">
                AvinayStudio
              </div>
              <div className="text-[10px] tracking-widest text-[#DFC08F] uppercase font-semibold">
                Founder Portal
              </div>
            </div>
          </Link>
          <p className="text-xs text-[#B8B3AB]">
            Restricted access. Sign in with your authorized administrator credentials.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 sm:p-9 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15 shadow-2xl shadow-black/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4C5B9]/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#DFC08F]">
              <ShieldCheck className="w-4 h-4 text-[#DFC08F]" />
              <span>Admin Authentication</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#75716B] font-mono">
              256-Bit SSL
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 mb-6 rounded-xl bg-[#171111] border border-[#442222] text-xs text-[#E8DFD8] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#DFC08F] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#75716B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@avinaystudio.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] placeholder-[#75716B] text-sm focus:outline-none focus:border-[#DFC08F] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#75716B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] placeholder-[#75716B] text-sm focus:outline-none focus:border-[#DFC08F] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#75716B] hover:text-[#B8B3AB] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(223,192,143,0.25)] disabled:opacity-50 mt-6"
            >
              {loading ? 'Authenticating...' : 'Sign In to Console'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-[#75716B] hover:text-[#DFC08F] transition-colors">
            ← Return to Public Agency Website
          </Link>
        </div>

      </div>
    </div>
  );
}
