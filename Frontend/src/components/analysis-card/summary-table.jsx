'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { headerCell } from './utils/ui';
import { fmt } from './utils/stats';

export default function SummaryTable({
  rows,
  sortKey,
  sortDir,
  onSort,
  onFlipDir,
}) {
  const handleSort = (key) => {
    key === sortKey ? onFlipDir() : onSort(key);
  };

  // sort on render (pure)
  const sorted = [...rows].sort((a, b) => {
    const va = a[sortKey],
      vb = b[sortKey];
    const dir = sortDir === 'asc' ? 1 : -1;
    if (typeof va === 'string') return va.localeCompare(vb) * dir;
    return ((va ?? -Infinity) - (vb ?? -Infinity)) * dir;
  });

  return (
    <div className='-mx-3 px-3 overflow-x-auto'>
      <Table className='w-full min-w-[900px] text-[13px] sm:text-sm'>
        <TableHeader>
          <TableRow>
            {headerCell('Column', 'column', sortKey, sortDir, handleSort)}
            {headerCell('Count', 'count', sortKey, sortDir, handleSort)}
            {headerCell('Mean', 'mean', sortKey, sortDir, handleSort)}
            {headerCell('Std', 'std', sortKey, sortDir, handleSort)}
            {headerCell('Min', 'min', sortKey, sortDir, handleSort)}
            {headerCell('25%', 'p25', sortKey, sortDir, handleSort)}
            {headerCell('50%', 'p50', sortKey, sortDir, handleSort)}
            {headerCell('75%', 'p75', sortKey, sortDir, handleSort)}
            {headerCell('Max', 'max', sortKey, sortDir, handleSort)}
            {headerCell('Range', 'range', sortKey, sortDir, handleSort)}
            {headerCell('IQR', 'iqr', sortKey, sortDir, handleSort)}
            {headerCell('CV %', 'cv', sortKey, sortDir, handleSort)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.column}>
              <TableCell
                className='font-medium min-w-[160px] truncate'
                title={r.column}
              >
                {r.column}
              </TableCell>
              <TableCell className='tabular-nums'>{fmt(r.count)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.mean)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.std)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.min)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.p25)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.p50)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.p75)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.max)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.range)}</TableCell>
              <TableCell className='tabular-nums'>{fmt(r.iqr)}</TableCell>
              <TableCell className='tabular-nums'>
                {r.cv == null ? '—' : (r.cv * 100).toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
