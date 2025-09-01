import { Code } from 'lucide-react';
import Link from 'next/link';

import { NavigationItem } from '@/components/menus/NavigationItem';
import { ThemeToggle } from '@/components/menus/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { mainNavigationItems, NavigationMenuItem } from '@/lib/navigation/navigationItems';

export function AppSidebar() {
  const { generalNavigationItems, transfersNavigationItems } = mainNavigationItems.reduce<{
    generalNavigationItems: NavigationMenuItem[];
    transfersNavigationItems: NavigationMenuItem[];
  }>(
    (acc, item) => {
      if (item.hideFromSidebar) {
        return acc;
      }

      switch (item.section) {
        case 'general':
          acc.generalNavigationItems.push(item);
          break;
        case 'transfers':
          acc.transfersNavigationItems.push(item);
          break;
      }

      return acc;
    },
    {
      generalNavigationItems: [],
      transfersNavigationItems: [],
    },
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Locations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalNavigationItems.map((item) => (
                <NavigationItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <ThemeToggle />
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="https://github.com/wuguishifu/thermo-automation" target="_blank">
                <Code />
                <span>Version 0.0.1</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
