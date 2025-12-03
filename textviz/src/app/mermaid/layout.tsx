import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mermaid Diagram Editor - TextViz',
  description: 'Create and edit Mermaid diagrams with live preview',
};

export default function MermaidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
