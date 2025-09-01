import './globals.css';

import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(nunito.variable, 'antialiased min-h-screen w-full')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster richColors />
          <ReduxProvider>
            <div className="overflow-x-hidden w-full">{children}</div>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
