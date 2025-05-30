
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavigation } from '@/components/bottom-navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar'; // New Sidebar
import { Button } from '@/components/ui/button'; // For sidebar trigger
import { Settings2 } from 'lucide-react'; // App icon

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ChronoFlow',
  description: 'Budget your time effectively and track your progress.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background px-4 md:hidden print:hidden">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="h-8 w-8" />
                  <Settings2 className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-foreground">ChronoFlow</span>
                </div>
                 {/* You can add other mobile header items here if needed */}
              </header>
              <div className="relative flex min-h-screen flex-col">
                <main className="flex-1 p-4 pb-24 md:p-6 md:pb-24"> {/* Increased bottom padding for nav bar */}
                  {children}
                </main>
                <BottomNavigation /> {/* This will be below the main content */}
              </div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
