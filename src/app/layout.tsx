
"use client"; // Required for usePathname

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Allura } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavigation } from '@/components/bottom-navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { usePathname } from 'next/navigation'; // Import usePathname

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const allura = Allura({
  variable: '--font-allura',
  weight: ['400'],
  subsets: ['latin'],
});

// Metadata is usually defined outside the component in Next.js 13+ App Router
// For client components, if you need dynamic titles, you'd use the `document.title` API in useEffect
// However, for static metadata, it's best in a server component or route handler.
// For simplicity here, keeping it but acknowledging its limitations in a "use client" RootLayout.
export const metadataObject: Metadata = {
  title: 'Allocatr',
  description: 'Budget your time effectively and track your progress.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBottomNav = !['/preferences', '/data-management'].includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${allura.variable} antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background px-4 md:hidden print:hidden">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="h-8 w-8" />
                  <div className="font-logoScript text-2xl font-semibold text-primary">Allocatr</div>
                </div>
              </header>
              <div className="relative flex min-h-screen flex-col">
                <main className="flex-1 p-4 pb-24 md:p-6 md:pb-24">
                  {children}
                </main>
                {showBottomNav && <BottomNavigation />}
              </div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
