
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, ListChecks, Target, Zap } from 'lucide-react'; // Added Zap, ListChecks, Target
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Launcher', icon: Zap },
  { href: '/timeline', label: 'Timeline', icon: ListChecks },
  { href: '/tracker', label: 'Tracker', icon: Target },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg print:hidden">
      <div className="mx-auto flex h-16 max-w-screen-sm items-center justify-around px-2 sm:px-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} passHref legacyBehavior>
            <a
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-20 h-full",
                (pathname === item.href || (item.href === "/" && pathname.startsWith("/#"))) && "text-primary" // Handle root path active state
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </a>
          </Link>
        ))}
        <div className="flex items-center justify-center w-20 h-full">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

