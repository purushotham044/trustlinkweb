import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function RegisterPage() {
  const { user, signUpWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!form.email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = validate();
    if (err) return setError(err);
    const result = await signUpWithEmail(form.email, form.password, form.fullName);
    if (result.success) setSuccess(true);
    else setError(result.error ?? 'Registration failed. Please try again.');
  };

  if (success) return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle size={56} className="text-[#10B981] mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-[#F1F5F9] mb-3">Account Created!</h2>
        <p className="text-[#94A3B8] mb-8">Check your email to confirm your address, then sign in to access your vault.</p>
        <Link to="/login"><Button variant="primary" fullWidth>Sign In to Your Vault</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0E1A] bg-grid flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#00D4FF] flex items-center justify-center">
              <Shield size={20} className="text-[#00D4FF]" />
            </div>
            <span className="font-bold text-[#F1F5F9] tracking-[0.15em]">TRUSTLINK</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F1F5F9] mb-1">Create Your Vault</h1>
          <p className="text-sm text-[#475569]">Set up your personal verifiable document vault</p>
        </div>

        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8">
          {error && (
            <div className="flex items-start gap-2 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] rounded-xl p-4 mb-6">
              <span className="text-[#EF4444]">⚠</span>
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Input label="Full Name" type="text" placeholder="Jane Smith" value={form.fullName} onChange={set('fullName')} autoComplete="name" />
            <Input label="Email" type="email" placeholder="name@company.com" value={form.email} onChange={set('email')} autoComplete="email" />
            <Input label="Password" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
            <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[#475569] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00D4FF] hover:text-[#0099BB] font-semibold transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
