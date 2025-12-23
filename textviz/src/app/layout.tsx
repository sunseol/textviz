import type { Metadata } from "next";
import { Geist_Mono, Bona_Nova_SC } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TextieChat } from "@/components/ai/TextieChat";

const GA_TRACKING_ID = "G-DW8FS4901Y";
const CLARITY_PROJECT_ID = "uq158sowwt";

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
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
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
        suppressHydrationWarning={true}
      >
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
        <ThemeProvider />
        <TextieChat />
        {children}
      </body>
    </html>
  );
}
