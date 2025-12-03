import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LaTeX Editor - TextViz',
  description: 'Create and edit LaTeX documents with live PDF preview',
};

export default function LatexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
