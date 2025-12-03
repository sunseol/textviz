import type { Metadata } from "next";
import { Geist_Mono, Bona_Nova_SC } from "next/font/google";
import "./globals.css";

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
  title: "TextViz - Visual Text Editor Suite",
  description: "A powerful visual editor for Markdown, LaTeX, Mermaid diagrams, and JSON building",
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
        {children}
      </body>
    </html>
  );
}
