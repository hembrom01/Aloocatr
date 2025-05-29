
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListChecks, Target, Timer, Settings as TasksIcon } from 'lucide-react'; // Renamed Settings to TasksIcon for clarity
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Tracker', icon: Timer },
  { href: '/timeline', label: 'Timeline', icon: ListChecks },
  { href: '/tracker', label: 'Progress', icon: Target }, // Changed label to 'Progress' for clarity
  { href: '/settings', label: 'Tasks', icon: TasksIcon }, // Changed label from Settings to Tasks
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg print:hidden">
      <div className="mx-auto flex h-16 max-w-screen-sm items-center justify-around px-2 sm:px-4">
        {menuItems.map((item) => {
          let isActive = pathname === item.href;
          // Special handling for the root path to avoid both 'Tracker' icons being active
          if (item.href === '/' && pathname.startsWith('/#')) { // Catches paths like /#some_hash
            isActive = true;
          } else if (item.href === '/' && pathname !== '/' && item.label === 'Tracker') {
             // If we are not on exactly '/', the main 'Tracker' (Launcher) should not be active
             // unless it's the specific case handled above.
             // This helps distinguish from the '/tracker' (Progress) page.
            isActive = false;
          }


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
