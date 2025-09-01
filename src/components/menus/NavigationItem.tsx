import Link from 'next/link';

import { ChordBadge } from '@/components/menus/ChordBadge';
import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavigationMenuItem } from '@/lib/navigation/navigationItems';

export function NavigationItem({ item }: { item: NavigationMenuItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title}>
        <Link href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {item.chord && (
        <ChordBadge wrapper={SidebarMenuBadge} className="opacity-0 group-hover/menu-item:opacity-75">
          {item.chord}
        </ChordBadge>
      )}
    </SidebarMenuItem>
  );
}
