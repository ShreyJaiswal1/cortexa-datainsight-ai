'use client';

import { Progress } from '@/components/ui/progress';

export default function MissingPanel({ items }) {
  if (!items?.length)
    return (
      <p className='text-sm text-muted-foreground'>No missing data detected.</p>
    );

  return (
    <div className='space-y-2 sm:space-y-3'>
      {items.map((m) => (
        <div
          key={m.column}
          className='grid grid-cols-12 items-center gap-2 sm:gap-3'
        >
          <div
            className='col-span-4 md:col-span-3 font-medium truncate'
            title={m.column}
          >
            {m.column}
          </div>
          <div className='col-span-6 md:col-span-7'>
            <Progress value={m.pct} className='h-2' />
          </div>
          <div className='col-span-2 text-right text-xs sm:text-sm text-muted-foreground'>
            {m.pct.toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}
