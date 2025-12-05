import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Moon, Sun, Download, Languages } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useExportImage } from '@/hooks/useExportImage';
import { AuthButton } from '@/components/auth/AuthButton';

export function Header() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { downloadImage } = useExportImage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ko' : 'en');
  };

  const navItems = [
    { name: t.nav.markdown, href: '/markdown' },
    { name: t.nav.latex, href: '/latex' },
    { name: t.nav.mermaid, href: '/mermaid' },
    { name: t.nav.jsonBuilder, href: '/json-builder' },
    { name: t.nav.repository, href: '/repository' },
  ];

  const getExportConfig = () => {
    if (pathname === '/markdown') return { id: 'markdown-preview', name: 'markdown-export' };
    if (pathname === '/latex') return { id: 'latex-preview', name: 'latex-export' };
    if (pathname === '/mermaid') return { id: 'mermaid-preview', name: 'mermaid-export' };
    return null;
  };

  const exportConfig = getExportConfig();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-2xl tracking-wide" style={{ fontFamily: 'var(--font-bona-nova-sc)' }}>
              TextViz
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Optional: Add search or command menu here later */}
          </div>
          <nav className="flex items-center space-x-2">
            {exportConfig && (
              <button
                onClick={() => downloadImage(exportConfig.id, exportConfig.name)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 mr-2 border border-input bg-transparent shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                {t.header.export}
              </button>
            )}

            <button
              onClick={toggleLanguage}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
              title={language === 'en' ? '한국어' : 'English'}
            >
              <Languages className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
