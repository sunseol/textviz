import { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <main className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      {children}
    </main>
  );
}
