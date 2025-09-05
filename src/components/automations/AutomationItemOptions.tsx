import { useCallback } from 'react';

import { useDeleteAutomationMutation } from '@/api/automationsApiSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AutomationItemOptionsProps = {
  children: React.ReactNode;
  automationId: number;
  asChild?: boolean;
};

export function AutomationItemOptions({ children, automationId, asChild }: AutomationItemOptionsProps) {
  const [deleteAutomation, { isLoading }] = useDeleteAutomationMutation();

  const handleDelete = useCallback(() => {
    if (isLoading) {
      return;
    }

    deleteAutomation({ id: automationId });
  }, [deleteAutomation, isLoading, automationId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={asChild} className="cursor-pointer">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onSelect={handleDelete}>
            <span className="text-destructive">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
