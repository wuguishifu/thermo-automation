import { PropsWithChildren } from 'react';

import { SidebarButton } from '@/components/menus/SidebarButton';
import { cn } from '@/lib/utils';

type PageComponentProps = PropsWithChildren<{ className?: string }>;

export function PageWrapper({ children, className }: PageComponentProps) {
  return <main className={cn('w-full h-full', className)}>{children}</main>;
}

export function PageHeader({ children, className }: PageComponentProps) {
  return (
    <header className={cn('w-full flex items-center gap-2 px-2.5 pt-2 fixed top-0 bg-background', className)}>
      <SidebarButton />
      {children}
    </header>
  );
}

export function PageContent({ children, className }: PageComponentProps) {
  return <div className={cn('pt-12 px-4 h-full', className)}>{children}</div>;
}
