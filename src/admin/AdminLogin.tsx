import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Sparkles } from 'lucide-react';
import {
  getFirebaseAuth,
  getFirebaseConfigHelpMessage,
  isFirebaseConfigured,
} from '../firebase/client';
import { adminApi } from './api';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const configError = React.useMemo(
    () => (isFirebaseConfigured() ? '' : getFirebaseConfigHelpMessage()),
    [],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isFirebaseConfigured()) {
        throw new Error(getFirebaseConfigHelpMessage());
      }

      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await adminApi.verify();
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050713] px-4 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.18),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(56,216,255,0.10),transparent_34%)]" />
      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-violet-400/20 bg-[#101827]/80 p-8 shadow-[0_30px_120px_rgba(5,7,19,0.65)] backdrop-blur-2xl md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] text-white shadow-[0_20px_60px_rgba(37,99,235,0.3)]">
            <Lock size={24} />
          </div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-white/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
            <Sparkles size={12} />
            SKH Admin
          </div>
          <h1 className="text-3xl font-black text-white">Sign in</h1>
          <p className="mt-2 text-sm text-slate-400">Authorized admin access only</p>
        </div>

        {configError ? (
          <p className="mb-5 rounded-2xl border border-amber-400/25 bg-amber-400/[0.08] px-4 py-3 text-sm leading-relaxed text-amber-50">
            {configError}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#050713]/80 px-5 py-4 text-white outline-none focus:border-cyan-300/45"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#050713]/80 px-5 py-4 text-white outline-none focus:border-cyan-300/45"
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-100">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading || Boolean(configError)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] px-6 py-4 text-sm font-black text-white shadow-[0_18px_52px_rgba(37,99,235,0.28)] disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
};
