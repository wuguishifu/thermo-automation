import { cn } from '@/lib/utils';

export function ChordBadge({
  children,
  wrapper,
  className,
}: {
  children: [string, string];
  className?: string;
  wrapper?: React.ElementType;
}) {
  const Wrapper = wrapper || 'div';

  return (
    <Wrapper className={cn('flex gap-1 items-center', className)}>
      <div className="dark border border-inherit w-5 rounded-sm flex justify-center">{children[0]}</div>
      <div>then</div>
      <div className="dark border border-inherit w-5 rounded-sm flex justify-center">{children[1]}</div>
    </Wrapper>
  );
}
