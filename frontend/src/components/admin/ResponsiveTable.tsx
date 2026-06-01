import { ReactNode } from 'react';

interface ResponsiveTableProps {
  children: ReactNode;
}

function ResponsiveTable({ children }: ResponsiveTableProps) {
  return (
    <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="min-w-[640px] sm:min-w-full">
        {children}
      </div>
    </div>
  );
}

export default ResponsiveTable;