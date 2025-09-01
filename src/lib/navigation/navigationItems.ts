import { Cog, Home, LucideIcon, MapPin } from 'lucide-react';

import { Chord, NavigationCommand } from '@/components/commands/types';

export type NavigationMenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  chord: Chord;
  hideFromSidebar?: boolean;
  section: 'general' | 'locations';
};

export const mainNavigationItems: NavigationMenuItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    chord: ['G', 'm'],
    section: 'general',
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Cog,
    chord: ['G', 's'],
    section: 'general',
  },
  {
    title: 'Locations',
    url: '/locations',
    icon: MapPin,
    chord: ['G', 'l'],
    section: 'locations',
  },
];

export const navigationCommands: NavigationCommand[] = mainNavigationItems.map((item) => ({
  chord: item.chord,
  target: { url: item.url },
}));
