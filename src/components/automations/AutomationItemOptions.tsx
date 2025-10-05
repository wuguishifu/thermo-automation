import { useCallback, useState } from 'react';

import {
  useDeleteAutomationMutation,
  useDisableAutomationMutation,
  useEnableAutomationMutation,
} from '@/api/automationsApiSlice';
import { EditAutomationDialog } from './EditAutomationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Automation } from '@/types/automation';

type AutomationItemOptionsProps = {
  children: React.ReactNode;
  automation: Automation;
  asChild?: boolean;
};

export function AutomationItemOptions({ children, automation, asChild }: AutomationItemOptionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteAutomation, { isLoading }] = useDeleteAutomationMutation();
  const [enableMutation, { isLoading: isEnabling }] = useEnableAutomationMutation();
  const [disableMutation, { isLoading: isDisabling }] = useDisableAutomationMutation();

  const handleDelete = useCallback(() => {
    if (isLoading) {
      return;
    }

    deleteAutomation({ id: automation.id });
  }, [deleteAutomation, isLoading, automation.id]);

  const handleEnabled = useCallback(() => {
    if (isEnabling) {
      return;
    }

    enableMutation({ id: automation.id });
  }, [enableMutation, isEnabling, automation.id]);

  const handleDisabled = useCallback(() => {
    if (isDisabling) {
      return;
    }

    disableMutation({ id: automation.id });
  }, [disableMutation, isDisabling, automation.id]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={asChild} className="cursor-pointer">
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onSelect={() => setEditOpen(true)}>
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onSelect={automation.enabled ? handleDisabled : handleEnabled}>
              <span>{automation.enabled ? 'Disable' : 'Enable'} Automation</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onSelect={handleDelete}>
              <span className="text-destructive">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAutomationDialog open={editOpen} onOpenChange={setEditOpen} automation={automation} />
    </>
  );
}
