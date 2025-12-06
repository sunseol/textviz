import type { Metadata } from "next";
import { Geist_Mono, Bona_Nova_SC } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bonaNovaSC = Bona_Nova_SC({
  weight: ["400", "700"],
  variable: "--font-bona-nova-sc",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TextViz - Don't Scatter It, Gather It Here",
  description: "Knowledge is more valuable when gathered. A powerful visual editor for Markdown, LaTeX, Mermaid diagrams, and JSON building.",
  openGraph: {
    title: "TextViz - Gather Your Knowledge",
    description: "Don't scatter your ideas. Write, visualize, and organize them in one place.",
    type: "website",
    locale: "ko_KR", // Primary target seems to be Korean user base based on request
    siteName: "TextViz",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-32x32.png' },
    ],
  },
  keywords: ["Markdown Editor", "LaTeX Editor", "Mermaid Diagrams", "JSON Builder", "Visual Editor", "Note Taking", "Knowledge Base"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${bonaNovaSC.variable} antialiased`}
      >
        <ThemeProvider />
        {children}
      </body>
    </html>
  );
}
