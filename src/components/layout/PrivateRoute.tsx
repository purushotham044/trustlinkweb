import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#475569]">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
