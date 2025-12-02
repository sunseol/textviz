import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string; // Tailwind text color class like "text-blue-500"
}

export function NavigationCard({
  title,
  description,
  href,
  icon: Icon,
  color,
}: NavigationCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
    >
      <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-accent/80", color.replace("text-", "bg-").replace("-500", "-100"))}>
        <Icon className={cn("h-6 w-6", color)} />
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
