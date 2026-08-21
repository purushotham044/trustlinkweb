// ============================================================
// TrustLink Web — Executive Upload Progress & Animation Modal
// Provides rich visual feedback with step transitions during file upload
// ============================================================

import React, { useEffect } from 'react';
import { Shield, Check, CloudUpload, Lock, Database, Loader2 } from 'lucide-react';

export interface UploadProgressState {
  visible: boolean;
  fileName: string;
  step: number; // 1: Hashing, 2: Uploading, 3: Registering, 4: Complete
  statusText: string;
  isComplete: boolean;
}

interface UploadProgressModalProps {
  state: UploadProgressState;
  onClose?: () => void;
}

export const UploadProgressModal: React.FC<UploadProgressModalProps> = ({ state, onClose }) => {
  // Auto-close after completion
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.visible && state.isComplete && onClose) {
      timer = setTimeout(() => {
        onClose();
      }, 1400);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [state.visible, state.isComplete, onClose]);

  if (!state.visible) return null;

  const getProgressPercentage = () => {
    if (state.isComplete || state.step >= 4) return 100;
    if (state.step === 3) return 85;
    if (state.step === 2) return 60;
    if (state.step === 1) return 30;
    return 10;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
        {/* Animated Glow Icon */}
        <div className="relative mb-4 flex items-center justify-center">
          <div
            className={`absolute w-16 h-16 rounded-full blur-md transition-all duration-500 ${
              state.isComplete
                ? 'bg-emerald-500/20'
                : 'bg-indigo-500/20 animate-pulse'
            }`}
          />
          <div
            className={`relative w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 ${
              state.isComplete
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {state.isComplete ? (
              <Check className="w-7 h-7 animate-in zoom-in duration-300" />
            ) : (
              <CloudUpload className="w-7 h-7 animate-bounce" />
            )}
          </div>
        </div>

        {/* Title & File Name */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-1">
          {state.isComplete ? 'Document Secured!' : 'Securing Document'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center truncate max-w-xs mb-5">
          {state.fileName}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5 border border-slate-200/50 dark:border-slate-700/50">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              state.isComplete ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Multi-Step Timeline */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 space-y-2.5 mb-4 border border-slate-200 dark:border-slate-700/50">
          {/* Step 1 */}
          <div className="flex items-center gap-3 text-xs">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                state.step > 1
                  ? 'bg-emerald-500 text-white'
                  : state.step === 1
                  ? 'bg-indigo-600 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {state.step > 1 ? <Check className="w-3 h-3" /> : '1'}
            </div>
            <span
              className={`truncate ${
                state.step === 1
                  ? 'font-semibold text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Computing SHA-256 cryptographic fingerprint
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 text-xs">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                state.step > 2
                  ? 'bg-emerald-500 text-white'
                  : state.step === 2
                  ? 'bg-indigo-600 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {state.step > 2 ? <Check className="w-3 h-3" /> : '2'}
            </div>
            <span
              className={`truncate ${
                state.step === 2
                  ? 'font-semibold text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Encrypting & uploading to vault storage
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 text-xs">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                state.step > 3
                  ? 'bg-emerald-500 text-white'
                  : state.step === 3
                  ? 'bg-indigo-600 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {state.step > 3 ? <Check className="w-3 h-3" /> : '3'}
            </div>
            <span
              className={`truncate ${
                state.step === 3
                  ? 'font-semibold text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Recording immutable integrity ledger entry
            </span>
          </div>
        </div>

        {/* Status Text */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center mb-3">
          {state.statusText}
        </p>

        {/* Done / Dismiss Button */}
        {state.isComplete && onClose && (
          <button
            onClick={onClose}
            className="px-6 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};
