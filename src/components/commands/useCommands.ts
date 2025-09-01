import { useTheme } from 'next-themes';
import { useCallback, useMemo } from 'react';

import { Command } from '@/components/commands/types';
import { useSidebar } from '@/components/ui/sidebar';
import { navigationCommands } from '@/lib/navigation/navigationItems';

export function useCommands() {
  const { setTheme } = useTheme();
  const toggleTheme = useCallback(() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark')), [setTheme]);

  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const toggleSidebar = useCallback(
    () => (isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o)),
    [isMobile, setOpen, setOpenMobile],
  );

  return useMemo<Command[]>(
    () => [
      ...navigationCommands,
      { chord: ['G', 'L'], target: { action: toggleTheme } },
      { chord: ['G', 'b'], target: { action: toggleSidebar } },
    ],
    [toggleTheme, toggleSidebar],
  );
}
