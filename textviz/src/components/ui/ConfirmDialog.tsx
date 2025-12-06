"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* macOS-style Dialog Window */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="overflow-hidden rounded-xl border border-neutral-200/60 bg-white shadow-2xl dark:border-neutral-700/60 dark:bg-neutral-800">
          {/* macOS Window Header with traffic lights */}
          <div className="flex items-center border-b border-neutral-200/60 bg-neutral-50/80 px-4 py-3 dark:border-neutral-700/60 dark:bg-neutral-900/80">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="flex gap-4">
              {/* Icon */}
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg ${isDanger
                  ? 'bg-gradient-to-br from-red-400 to-red-500'
                  : 'bg-gradient-to-br from-amber-400 to-amber-500'
                }`}>
                <AlertCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {message}
                </p>
              </div>
            </div>

            {/* Buttons - macOS style (right aligned, cancel on left) */}
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-200 active:scale-95 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all active:scale-95 ${isDanger
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                  }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
