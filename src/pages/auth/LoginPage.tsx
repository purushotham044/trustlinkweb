import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Mail, Key, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type AuthMode = 'OTP' | 'PASSWORD';

export function LoginPage() {
  const { user, signInWithEmail, sendEmailOtp, verifyEmailOtp, signInWithGoogle, signInAsDemo, loading } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<AuthMode>('OTP');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) return setError('Please enter your email address.');

    const result = await sendEmailOtp(cleanEmail);
    if (result.success) {
      setOtpSent(true);
      setResendCountdown(60);
      setSuccessMessage(`A 6-digit verification code was sent to ${cleanEmail}`);
    } else {
      setError(result.error ?? 'Failed to send OTP code.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanOtp = otpCode.trim();

    if (!cleanOtp) return setError('Please enter the 6-digit verification code.');

    const result = await verifyEmailOtp(cleanEmail, cleanOtp);
    if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.error ?? 'Verification failed. Please check the code.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="flex items-start gap-2.5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] rounded-xl p-4 mb-6">
              <span className="text-[#EF4444] text-base leading-none">⚠</span>
              <div className="flex-1">
                <p className="text-sm text-[#EF4444] font-medium">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.25)] rounded-xl p-3.5 mb-6 text-xs text-emerald-400">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="flex bg-[#0A0E1A] p-1 rounded-xl border border-[#1E293B] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('OTP');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                authMode === 'OTP'
                  ? 'bg-[#111827] text-[#00D4FF] shadow-sm border border-[#1E293B]'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Instant OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('PASSWORD');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
                authMode === 'PASSWORD'
                  ? 'bg-[#111827] text-[#00D4FF] shadow-sm border border-[#1E293B]'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
          </div>

          {/* OTP Authentication Form */}
          {authMode === 'OTP' ? (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                  <Input
                    label="Work Email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
                    Send 6-Digit Code
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between bg-[#0A0E1A] p-3 rounded-xl border border-[#1E293B] text-xs">
                    <span className="text-[#94A3B8] truncate max-w-[220px]">Sent to: <strong className="text-white">{email}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                        setSuccessMessage(null);
                      }}
                      className="text-[#00D4FF] font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <Input
                    label="6-Digit Verification Code"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    autoFocus
                  />

                  <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
                    Verify & Sign In
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={resendCountdown > 0 || loading}
                    className="inline-flex items-center justify-center gap-1.5 text-xs text-[#00D4FF] disabled:text-[#475569] hover:underline pt-2 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Password Authentication Form */
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5" noValidate>
              <Input label="Email" type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <div className="relative">
                <Input label="Password" type={showPwd ? 'text' : 'password'} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" className="absolute right-4 top-9 text-[#475569] hover:text-[#94A3B8] transition-colors" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
                Sign In with Password
              </Button>
            </form>
          )}

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1E293B]" />
            <span className="text-[11px] text-[#475569]">or continue with</span>
            <div className="flex-1 h-px bg-[#1E293B]" />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <Button variant="ghost" size="md" fullWidth onClick={handleGoogle} disabled={loading}>
              <span className="mr-2 text-base">G</span> Continue with Google
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                signInAsDemo();
                navigate('/app/dashboard');
              }}
            >
              ⚡ Instant Demo Sign-In
            </Button>
          </div>
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
