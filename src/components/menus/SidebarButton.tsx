import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SidebarButton() {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <SidebarTrigger className="cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent>
        <span className="flex items-center gap-1">
          <span className="rounded-sm border border-neutral-700 dark:border-neutral-200 w-5 text-center">G</span>
          <span> then </span>
          <span className="rounded-sm border border-neutral-700 dark:border-neutral-200 w-5 text-center">b</span>
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
