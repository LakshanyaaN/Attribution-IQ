
    
  
'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

type Role = 'analyst' | 'manager';

const accounts: Record<Role, { email: string; permission: string }> = {
  analyst: { email: 'analyst@attributioniq.internal', permission: 'app_analyst (Read-Only)' },
  manager: { email: 'manager@attributioniq.internal', permission: 'app_manager (Read/Write)' },
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('analyst');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('AttributionIQ2026!');
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError('');
    setShowPassword(false);
    setPassword('AttributionIQ2026!');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ role: selectedRole }),
     });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || 'Invalid email or password.');
        return;
      }
      window.location.replace('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Unable to connect to the server. Please try again.');
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden bg-[#F5EFEB]">

      {/* Background dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#DECFC2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative background blobs */}
      <div className="absolute top-12 left-1/3 w-64 h-64 rounded-full bg-[#E8594F]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-[#0D5C3A]/10 blur-3xl pointer-events-none" />

      {/* Main container */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#FAF6F0] border border-[#E8DEC8] shadow-2xl p-6 sm:p-8 md:p-12 overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 relative flex flex-col justify-between z-10 space-y-6">
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="w-4 h-4 text-[#E8594F] flex items-center justify-center text-lg font-bold">✦</span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#181E24] font-editorial italic">AttributionIQ</span>
              </div>
              <div className="inline-block bg-[#0D5C3A] text-white text-[10px] tracking-widest font-extrabold uppercase px-2.5 py-0.5 rounded-md">OMNICHANNEL SUITE</div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#181E24] tracking-tight font-editorial italic leading-[1.08]">
                Turn marketing <br />data into <br />
                <span className="relative inline-block text-[#181E24]">
                  clear attribution.
                  <span className="absolute bottom-1 left-0 w-full h-[4px] bg-[#D9483B] rounded-full opacity-80" />
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium leading-relaxed pt-2">A data-driven platform for multi-touch attribution, campaign analytics and creative intelligence.</p>
            </div>

            <div className="relative pt-6 h-64 sm:h-72 w-full select-none pointer-events-none">
              <div className="absolute top-0 right-4 sm:right-10 w-44 sm:w-56 z-20 transform rotate-[-4deg]">
                <img src="/collage/megaphone.png" alt="Megaphone" className="w-full object-contain filter drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-6 -left-4 w-36 sm:w-44 z-20">
                <img src="/collage/classical-statue.png" alt="Classical statue with pink glasses" className="w-full object-contain filter drop-shadow-md" />
              </div>
              <div className="absolute bottom-2 left-28 sm:left-36 w-36 sm:w-44 z-30 transform -rotate-3 hover:rotate-0 transition-transform">
                <img src="/collage/yellow-sticker.png" alt="Measure Smarter Advertise Better Sticker" className="w-full object-contain filter drop-shadow-md" />
              </div>
              <div className="absolute top-14 right-24 sm:right-32 w-10 sm:w-12 z-20 transform rotate-12">
                <img src="/collage/blue-star.png" alt="Blue Star" className="w-full object-contain filter drop-shadow-sm" />
              </div>
              <div className="absolute bottom-16 right-0 sm:right-4 w-36 sm:w-44 z-20 transform -rotate-6">
                <img src="/collage/advertising-works.png" alt="Advertising Works Sign" className="w-full object-contain filter drop-shadow-md" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end z-20">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#EADBCE]">
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181E24] font-editorial italic">Welcome back.</h2>
                  <span className="text-amber-500 text-lg">✦</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Log in to your AttributionIQ workspace.</p>
              </div>

              <div className="mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                  <span>Choose your workspace</span>
                  
                </div>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  {(['analyst', 'manager'] as const).map((role) => (
                    <button key={role} type="button" onClick={() => handleRoleSelect(role)} disabled={loading} aria-pressed={selectedRole === role}
                      className={`py-2 px-3 rounded-xl text-left transition-all ${selectedRole === role ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{role === 'analyst' ? 'Analyst' : 'Manager'}</span>
                        {selectedRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" />}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{accounts[role].permission}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input id="login-email" type="email" readOnly value={accounts[selectedRole].email}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">Password</label>
                    <span className="text-xs text-slate-400">Workspace credentials</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input id="login-password" type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password" required value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]/20 focus:border-[#0D5C3A]" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 px-4 bg-[#0D5C3A] hover:bg-[#0A472C] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all">
                  <span>{loading ? 'Signing in...' : `Log In as ${selectedRole === 'analyst' ? 'Analyst' : 'Manager'}`}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase">or continue with</span>
              </div>
              <div className="space-y-2.5">
                <button type="button" disabled title="Google sign-in is not configured" className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-2.5 shadow-sm opacity-50 cursor-not-allowed">
                  <span className="font-extrabold text-base text-[#4285F4]">G</span><span>Continue with Google</span>
                </button>
                <button type="button" disabled title="Microsoft sign-in is not configured" className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center space-x-2.5 shadow-sm opacity-50 cursor-not-allowed">
                  <svg className="w-4 h-4" viewBox="0 0 21 21" aria-hidden="true"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
                  <span>Continue with Microsoft</span>
                </button>
              </div>
              <div className="mt-6 text-center text-xs text-slate-500">Need an account? <span className="font-bold text-[#0D5C3A]">Contact your workspace administrator.</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}