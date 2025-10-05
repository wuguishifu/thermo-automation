import './globals.css';

import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { CommandMenu } from '@/components/commands/CommandMenu';
import { CommandPaletteListener } from '@/components/commands/CommandPaletteListener';
import { AppSidebar } from '@/components/menus/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ReduxProvider } from '@/state/provider';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Thermo Automation',
  description: 'Hostable client for Daikin thermostat automation',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const defaultOpen = cookiesStore.get('sidebar_state')?.value !== 'false';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(nunito.variable, 'antialiased min-h-screen w-full')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster richColors />
          <SidebarProvider defaultOpen={defaultOpen}>
            <ReduxProvider>
              <CommandPaletteListener />
              <CommandMenu />
              <AppSidebar />
              <div className="overflow-x-hidden w-full">{children}</div>
            </ReduxProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
