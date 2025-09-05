'use client';

import { Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { mainNavigationItems } from '@/lib/navigation/navigationItems';

export function CommandMenu() {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const shiftDown = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      if (e.key === 'Shift') {
        shiftDown.current += 1;
      }
    };

    const up = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        shiftDown.current -= 1;
      }
    };

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  const withClose = useCallback((action: () => void): (() => void) => {
    return () => {
      action();
      if (shiftDown.current <= 0) {
        setOpen(false);
      }
    };
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {mainNavigationItems.map((item) => (
            <CommandItem
              className="cursor-pointer"
              key={item.title}
              id={item.url}
              onSelect={withClose(() => router.push(item.url))}
            >
              <item.icon />
              <span className="flex-1">{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Settings">
          <CommandItem
            className="cursor-pointer"
            onSelect={withClose(() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark')))}
          >
            <Moon className="block dark:hidden" />
            <Sun className="hidden dark:block" />
            <span>Toggle Theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
