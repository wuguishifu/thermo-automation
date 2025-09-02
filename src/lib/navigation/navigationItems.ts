import { Cog, Home, LucideIcon, MapPin, Thermometer, Workflow } from 'lucide-react';

import { Chord, NavigationCommand } from '@/components/commands/types';

export type NavigationMenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  chord: Chord;
  hideFromSidebar?: boolean;
  section: 'general' | 'automation';
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
    title: 'All Devices',
    url: '/devices',
    icon: Thermometer,
    chord: ['G', 'd'],
    section: 'general',
  },
  {
    title: 'Locations',
    url: '/locations',
    icon: MapPin,
    chord: ['G', 'l'],
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
    title: 'Automations',
    url: '/automations',
    icon: Workflow,
    chord: ['G', 'a'],
    section: 'automation',
  },
];

export const navigationCommands: NavigationCommand[] = mainNavigationItems.map((item) => ({
  chord: item.chord,
  target: { url: item.url },
}));
