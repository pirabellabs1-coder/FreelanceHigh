interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper that adds horizontal scroll on small screens for wide tables.
 */
export function ResponsiveTable({
  children,
  className = "",
}: ResponsiveTableProps) {
  return (
    <div className={`overflow-x-auto -mx-4 sm:mx-0 ${className}`}>
      <div className="min-w-[600px] sm:min-w-0">{children}</div>
    </div>
  );
}
