import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginPage() {
  const { signInWithEmail, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return setError('Please enter your email address.');
    if (!password) return setError('Please enter your password.');
    const result = await signInWithEmail(email, password);
    if (result.success) navigate('/app/dashboard');
    else setError(result.error ?? 'Sign-in failed. Please check your credentials.');
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await signInWithGoogle();
    if (!result.success && result.error) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] bg-grid flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#00D4FF] flex items-center justify-center">
              <Shield size={20} className="text-[#00D4FF]" />
            </div>
            <span className="font-bold text-[#F1F5F9] tracking-[0.15em]">TRUSTLINK</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F1F5F9] mb-1">Sign In to Your Vault</h1>
          <p className="text-sm text-[#475569]">Verifiable Document Integrity Vault</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8">
          {error && (
            <div className="flex items-start gap-2 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] rounded-xl p-4 mb-6">
              <span className="text-[#EF4444]">⚠</span>
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Input label="Email" type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            <div className="relative">
              <Input label="Password" type={showPwd ? 'text' : 'password'} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" className="absolute right-4 top-9 text-[#475569] hover:text-[#94A3B8] transition-colors" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1E293B]" />
            <span className="text-[11px] text-[#475569]">or continue with</span>
            <div className="flex-1 h-px bg-[#1E293B]" />
          </div>

          <Button variant="ghost" size="md" fullWidth onClick={handleGoogle} disabled={loading}>
            <span className="mr-2 text-base">G</span> Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-[#475569] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00D4FF] hover:text-[#0099BB] font-semibold transition-colors">Create Account</Link>
        </p>

        <p className="text-center text-[11px] text-[#475569] mt-4 flex items-center justify-center gap-1.5">
          <Shield size={11} className="text-[#475569]" />
          Protected by PostgreSQL RLS &amp; Supabase Auth
        </p>
      </div>
    </div>
  );
}
