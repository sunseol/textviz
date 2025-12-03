import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markdown Editor - TextViz',
  description: 'Create and edit Markdown documents with live preview',
};

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
