import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Moon, Sun, Github } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Header() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const navItems = [
    { name: 'Markdown', href: '/markdown' },
    { name: 'LaTeX', href: '/latex' },
    { name: 'Mermaid', href: '/mermaid' },
    { name: 'JSON Builder', href: '/json-builder' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-lg">
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
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
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
          </nav>
        </div>
      </div>
    </header>
  );
}
