import React, { useState } from 'react';
import { Upload, Hash, ShieldCheck, Link2, CheckCircle, AlertTriangle, ArrowDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type ResultState = 'verified' | 'modified' | 'blockchain' | null;
type Step = 0 | 1 | 2 | 3 | 4;

const DEMO_HASH = 'a3f8c2e91d47b65f0e8a2c3d4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3';

export function VerificationFlow() {
  const [step, setStep] = useState<Step>(0);
  const [result, setResult] = useState<ResultState>(null);
  const [running, setRunning] = useState(false);

  const runDemo = async (outcome: ResultState) => {
    setRunning(true);
    setResult(null);
    setStep(0);
    await delay(400); setStep(1);
    await delay(900); setStep(2);
    await delay(900); setStep(3);
    await delay(900); setStep(4);
    await delay(500);
    setResult(outcome);
    setRunning(false);
  };

  const reset = () => { setStep(0); setResult(null); };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#111827]" aria-labelledby="verify-heading">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-3">Document Verification</p>
          <h2 id="verify-heading" className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
            Cryptographic Verification Flow
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            See how TrustLink verifies a document's integrity through SHA-256 hashing and blockchain proof comparison.
          </p>
        </div>

        {/* Steps visual */}
        <div className="flex flex-col items-center gap-3 mb-12">
          {verifySteps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className={[
                'w-full max-w-sm flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500',
                step > i
                  ? 'bg-[rgba(0,212,255,0.06)] border-[rgba(0,212,255,0.3)] opacity-100'
                  : step === i && running
                  ? 'bg-[#1A2235] border-[#2D3748] opacity-100'
                  : 'bg-[#0A0E1A] border-[#1E293B] opacity-40',
              ].join(' ')}>
                <div className={[
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
                  step > i ? 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF]' : 'bg-[#1A2235] text-[#475569]',
                ].join(' ')}>
                  {step > i ? <CheckCircle size={18} /> : s.icon}
                </div>
                <div>
                  <p className={`text-sm font-semibold transition-colors duration-300 ${step > i ? 'text-[#F1F5F9]' : 'text-[#475569]'}`}>{s.label}</p>
                  <p className="text-[11px] text-[#475569]">{s.sub}</p>
                </div>
                {step === i + 1 && running && (
                  <div className="ml-auto w-4 h-4 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              {i < verifySteps.length - 1 && (
                <ArrowDown size={14} className={`transition-colors duration-300 ${step > i ? 'text-[#00D4FF]' : 'text-[#1E293B]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Hash display */}
        {step >= 2 && (
          <div className="mb-8 bg-[#0A0E1A] border border-[#1E293B] rounded-2xl p-5 animate-[fade-in_0.4s_ease-out]">
            <p className="text-[10px] text-[#475569] uppercase tracking-widest mb-2 font-semibold">SHA-256 Fingerprint</p>
            <code className="text-xs text-[#00D4FF] font-mono break-all">{DEMO_HASH}</code>
          </div>
        )}

        {/* Result */}
        {result && <VerifyResult result={result} />}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {!running && step === 0 && !result && (
            <>
              <Button variant="primary" onClick={() => runDemo('verified')} icon={<ShieldCheck size={16} />}>
                Demo: Document Verified
              </Button>
              <Button variant="danger" onClick={() => runDemo('modified')} icon={<AlertTriangle size={16} />}>
                Demo: Document Modified
              </Button>
              <Button variant="blockchain" onClick={() => runDemo('blockchain')} icon={<Link2 size={16} />}>
                Demo: Blockchain Confirmed
              </Button>
            </>
          )}
          {(result || (!running && step > 0)) && (
            <Button variant="ghost" onClick={reset} icon={<RotateCcw size={16} />}>
              Reset Demo
            </Button>
          )}
          {running && (
            <p className="text-sm text-[#475569] animate-pulse">Verifying...</p>
          )}
        </div>
      </div>
    </section>
  );
}

function VerifyResult({ result }: { result: ResultState }) {
  if (result === 'verified') return (
    <div className="bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.3)] rounded-2xl p-6 text-center animate-[slide-up_0.4s_ease-out]">
      <CheckCircle size={36} className="text-[#10B981] mx-auto mb-3" />
      <h3 className="text-lg font-bold text-[#10B981] mb-1">Document Verified</h3>
      <p className="text-sm text-[#94A3B8]">SHA-256 fingerprint matches the registered proof. Document integrity confirmed.</p>
    </div>
  );
  if (result === 'modified') return (
    <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] rounded-2xl p-6 text-center animate-[slide-up_0.4s_ease-out]">
      <AlertTriangle size={36} className="text-[#EF4444] mx-auto mb-3" />
      <h3 className="text-lg font-bold text-[#EF4444] mb-1">Document Modified</h3>
      <p className="text-sm text-[#94A3B8]">Fingerprint mismatch detected. The file does not match its registered cryptographic proof.</p>
    </div>
  );
  return (
    <div className="bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.3)] rounded-2xl p-6 text-center animate-[slide-up_0.4s_ease-out]">
      <Link2 size={36} className="text-[#8B5CF6] mx-auto mb-3" />
      <h3 className="text-lg font-bold text-[#8B5CF6] mb-1">Blockchain Proof Confirmed</h3>
      <p className="text-sm text-[#94A3B8]">Document hash verified against Ethereum Sepolia blockchain. Immutable proof of existence confirmed.</p>
    </div>
  );
}

const verifySteps = [
  { icon: <Upload size={18} />, label: 'Select Document', sub: 'Choose the file to verify' },
  { icon: <Hash size={18} />, label: 'Generate SHA-256 Hash', sub: 'Compute deterministic fingerprint' },
  { icon: <ShieldCheck size={18} />, label: 'Compare with Reference', sub: 'Match against registered proof' },
  { icon: <Link2 size={18} />, label: 'Verify Blockchain Proof', sub: 'Query Ethereum Sepolia network' },
  { icon: <CheckCircle size={18} />, label: 'Display Result', sub: 'Verified / Modified / Blockchain Confirmed' },
];

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
