'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ChordBadge } from '@/components/menus/ChordBadge';
import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
        className="cursor-pointer"
        tooltip="Toggle Theme"
      >
        <Moon className="block dark:hidden" />
        <Sun className="hidden dark:block" />
        <span className="block dark:hidden">Dark Mode</span>
        <span className="hidden dark:block">Light Mode</span>
      </SidebarMenuButton>
      <ChordBadge wrapper={SidebarMenuBadge} className="opacity-0 group-hover/menu-item:opacity-75">
        {['G', 'L']}
      </ChordBadge>
    </SidebarMenuItem>
  );
}
