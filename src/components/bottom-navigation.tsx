
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, ListChecks, Target, Timer } from 'lucide-react'; // Changed Zap to Timer
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Tracker', icon: Timer }, // Renamed Launcher to Tracker, changed icon
  { href: '/timeline', label: 'Timeline', icon: ListChecks },
  { href: '/tracker', label: 'Tracker', icon: Target }, // This is the budget tracker page, might need a different name later
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg print:hidden">
      <div className="mx-auto flex h-16 max-w-screen-sm items-center justify-around px-2 sm:px-4">
        {menuItems.map((item) => {
          // Temporary fix for duplicate tracker href, assuming the first one is the main tracker (page.tsx)
          // and the second one is the progress tracker.
          // This logic should be refined if hrefs are made unique.
          let isActive = pathname === item.href;
          if (item.label === 'Tracker' && item.href === '/tracker' && pathname === '/') {
            // If current page is '/' (main tracker) and this item is the budget tracker, it's not active
            isActive = false;
          } else if (item.label === 'Tracker' && item.href === '/' && pathname.startsWith('/#')) {
            isActive = true;
          }


          return (
            <Link key={item.href + item.label} href={item.href} passHref legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-20 h-full",
                  isActive && "text-primary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1 truncate">{item.label}</span>
              </a>
            </Link>
          );
        })}
        <div className="flex items-center justify-center w-20 h-full">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
