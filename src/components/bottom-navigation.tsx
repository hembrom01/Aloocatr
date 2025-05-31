
"use client";

import React from 'react'; // Added this line
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListChecks, Target, Timer, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Tracker', icon: Timer },
  { href: '/timeline', label: 'Timeline', icon: ListChecks },
  { href: '/tracker', label: 'Progress', icon: Target },
  { href: '/settings', label: 'Tasks', icon: ClipboardList },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg print:hidden">
      <div className="mx-auto flex h-16 max-w-screen-sm items-center justify-around px-2 sm:px-4">
        {menuItems.map((item) => {
          // Ensure isActive is only true on the client after mounting to avoid hydration mismatch
          // and handle the root path carefully.
          const isActive = isMounted && (
            pathname === item.href ||
            (item.href === '/' && pathname === '/') // Specifically for root
          );

          return (
            <Link key={item.href + item.label} href={item.href} passHref legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-1/4 h-full",
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
      </div>
    </nav>
  );
}
