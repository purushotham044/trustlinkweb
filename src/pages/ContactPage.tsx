import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, MessageSquare, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      alert('Please complete all required fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest bg-[rgba(0,212,255,0.08)] px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)]">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#F1F5F9] mt-6 mb-4">
              Contact TrustLink
            </h1>
            <p className="text-base text-[#94A3B8] max-w-xl mx-auto">
              Have questions about document verification, custom enterprise integrations, or security audits? Reach out to our team.
            </p>
          </div>

          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 sm:p-10 max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-[#10B981] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#F1F5F9] mb-2">Message Received</h3>
                <p className="text-sm text-[#94A3B8] mb-6">Thank you for reaching out. We will respond to your inquiry shortly.</p>
                <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Your Name" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
                <Input label="Email Address" type="email" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Message / Inquiry
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your security requirements or integration question..."
                    required
                    className="w-full px-4 py-3 rounded-[10px] border text-sm text-[#F1F5F9] placeholder-[#475569] bg-[#0A0E1A] border-[#1E293B] outline-none transition-all duration-200 focus:border-[#00D4FF]"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" fullWidth icon={<Mail size={16} />}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
