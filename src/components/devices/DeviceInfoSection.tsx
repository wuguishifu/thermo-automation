export function DeviceInfoSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-1 text-muted-foreground [&>p]:text-muted-foreground">{children}</div>
    </div>
  );
}
