import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutWrapperProps {
  children: ReactNode;
  className?: string;
}

export function LayoutWrapper({ children, className }: LayoutWrapperProps) {
  return (
    <main className="relative flex-1 w-full overflow-hidden">
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.06),transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.10),transparent_40%)]" />
      </div>
      <div
        className={cn(
          "relative mx-auto h-full max-w-[1600px] px-4 md:px-6",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
}
