import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Builder - TextViz',
  description: 'Build JSON structures visually with drag-and-drop interface',
};

export default function JsonBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
