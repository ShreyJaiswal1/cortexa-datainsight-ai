'use client';

import { TableHead } from '@/components/ui/table';

export function headerCell(label, key, sortKey, sortDir, onClick) {
  const active = key === sortKey;
  return (
    <TableHead
      className='cursor-pointer select-none whitespace-nowrap'
      onClick={() => onClick(key)}
    >
      <span className={active ? 'text-primary' : ''}>{label}</span>
      {active && <span>{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>}
    </TableHead>
  );
}
