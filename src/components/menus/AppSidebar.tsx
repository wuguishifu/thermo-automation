import { Code, Plus } from 'lucide-react';
import Link from 'next/link';

import { CreateAutomationDialog } from '@/components/automations/CreateAutomationDialog';
import { NavigationItem } from '@/components/menus/NavigationItem';
import { ThemeToggle } from '@/components/menus/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { mainNavigationItems, NavigationMenuItem } from '@/lib/navigation/navigationItems';

export function AppSidebar() {
  const { generalNavigationItems, automationNavigationItems } = mainNavigationItems.reduce<{
    generalNavigationItems: NavigationMenuItem[];
    automationNavigationItems: NavigationMenuItem[];
  }>(
    (acc, item) => {
      if (item.hideFromSidebar) {
        return acc;
      }

      switch (item.section) {
        case 'general':
          acc.generalNavigationItems.push(item);
          break;
        case 'automation':
          acc.automationNavigationItems.push(item);
          break;
      }

      return acc;
    },
    {
      generalNavigationItems: [],
      automationNavigationItems: [],
    },
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalNavigationItems.map((item) => (
                <NavigationItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Automation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {automationNavigationItems.map((item) => (
                <NavigationItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <CreateAutomationDialog asChild>
            <SidebarGroupAction className="cursor-pointer">
              <Plus />
              <span className="sr-only">Create Automation</span>
            </SidebarGroupAction>
          </CreateAutomationDialog>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <ThemeToggle />
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="https://github.com/wuguishifu/thermo-automation" target="_blank">
                <Code />
                <span>Version 0.1.2</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
