'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Copy, Download, BarChart3, Info } from 'lucide-react';

/**
 * AnalysisCard — CONSISTENT (no shifting/breaking)
 * - Locks layout widths and prevents content from pushing the grid
 * - Mobile-friendly (icon actions, compact paddings)
 * - Table scrolls without affecting card width
 */
export function AnalysisCard({ analysisData }) {
  const [sortKey, setSortKey] = useState('column');
  const [sortDir, setSortDir] = useState('asc');

  const { columns, nRows, numericCount, rowsSumm, missingByCol, stdRanks } =
    useMemo(() => {
      if (!analysisData || typeof analysisData !== 'object') {
        return {
          columns: [],
          nRows: 0,
          numericCount: 0,
          rowsSumm: [],
          missingByCol: [],
          stdRanks: [],
        };
      }
      const cols = Object.keys(analysisData);

      let n = 0;
      cols.forEach((c) => {
        const v = Number(analysisData[c]?.count ?? 0);
        if (!Number.isNaN(v)) n = Math.max(n, v);
      });

      const numericCols = cols.filter(
        (c) => !Number.isNaN(Number(analysisData[c]?.mean))
      );

      const rows = cols.map((c) => ({
        column: c,
        count: num(analysisData[c]?.count),
        mean: num(analysisData[c]?.mean),
        std: num(analysisData[c]?.std),
        min: num(analysisData[c]?.min),
        p25: num(analysisData[c]?.['25%']),
        p50: num(analysisData[c]?.['50%']),
        p75: num(analysisData[c]?.['75%']),
        max: num(analysisData[c]?.max),
      }));

      const missing = cols.map((c) => {
        const cnt = Number(analysisData[c]?.count ?? 0);
        const miss = n > 0 ? Math.max(n - cnt, 0) : 0;
        const pct = n > 0 ? (miss / n) * 100 : 0;
        return { column: c, missing: miss, pct };
      });

      const stds = rows
        .map((r) => ({ column: r.column, std: r.std }))
        .filter((r) => isFiniteNumber(r.std))
        .sort((a, b) => (b.std ?? 0) - (a.std ?? 0))
        .slice(0, 3);

      return {
        columns: cols,
        nRows: n,
        numericCount: numericCols.length,
        rowsSumm: rows,
        missingByCol: missing,
        stdRanks: stds,
      };
    }, [analysisData]);

  const sortedRows = useMemo(() => {
    const rows = [...rowsSumm];
    rows.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const dir = sortDir === 'asc' ? 1 : -1;
      if (typeof va === 'string') return va.localeCompare(vb) * dir;
      return ((va ?? -Infinity) - (vb ?? -Infinity)) * dir;
    });
    return rows;
  }, [rowsSumm, sortKey, sortDir]);

  const handleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (!analysisData) return null;

  return (
    <Card className='w-full overflow-hidden dark:bg-gray-800/80'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-3'>
          {/* Left: title/desc — don't allow it to grow beyond card */}
          <div className='min-w-0'>
            <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
              <BarChart3 className='h-4 w-4 text-primary shrink-0' />
              <span className='truncate'>Dataset Overview</span>
            </CardTitle>
            <CardDescription className='mt-1 text-xs sm:text-sm'>
              Quick summary generated from your uploaded file.
            </CardDescription>
          </div>
          {/* Right: actions — fixed width so they don't push content */}
          <div className='shrink-0 flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              className='sm:hidden'
              onClick={() =>
                copyToClipboard(JSON.stringify(analysisData, null, 2))
              }
              aria-label='Copy JSON'
            >
              <Copy className='h-4 w-4' />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              className='sm:hidden'
              onClick={() => downloadJSON(analysisData)}
              aria-label='Export'
            >
              <Download className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='hidden sm:inline-flex'
              onClick={() =>
                copyToClipboard(JSON.stringify(analysisData, null, 2))
              }
            >
              <Copy className='mr-2 h-3.5 w-3.5' /> Copy JSON
            </Button>
            <Button
              variant='secondary'
              size='sm'
              className='hidden sm:inline-flex'
              onClick={() => downloadJSON(analysisData)}
            >
              <Download className='mr-2 h-3.5 w-3.5' /> Export
            </Button>
          </div>
        </div>

        {/* KPIs — always 2 cols on mobile, 4 on md+ */}
        <div className='mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3'>
          <KPI label='Rows' value={formatNumber(nRows)} />
          <KPI label='Columns' value={columns.length} />
          <KPI label='Numeric cols' value={numericCount} />
          <KPI
            label='Missing (max col)'
            value={`${maxMissing(missingByCol)}%`}
            subtle
          />
        </div>
      </CardHeader>

      <CardContent className='min-w-0'>
        <Tabs defaultValue='table' className='w-full'>
          {/* Tabs header — equal widths, no wrapping */}
          <TabsList className='grid grid-cols-3 w-full'>
            <TabsTrigger value='table'>Summary</TabsTrigger>
            <TabsTrigger value='missing'>Missing</TabsTrigger>
            <TabsTrigger value='insights'>Insights</TabsTrigger>
          </TabsList>

          {/* Summary table — isolate horizontal scroll */}
          <TabsContent value='table' className='mt-3 sm:mt-4'>
            <div className='-mx-3 px-3 overflow-x-auto'>
              <Table className='w-full min-w-[720px] text-[13px] sm:text-sm'>
                <TableHeader>
                  <TableRow>
                    {headerCell(
                      'Column',
                      'column',
                      sortKey,
                      sortDir,
                      handleSort
                    )}
                    {headerCell('Count', 'count', sortKey, sortDir, handleSort)}
                    {headerCell('Mean', 'mean', sortKey, sortDir, handleSort)}
                    {headerCell('Std', 'std', sortKey, sortDir, handleSort)}
                    {headerCell('Min', 'min', sortKey, sortDir, handleSort)}
                    {headerCell('25%', 'p25', sortKey, sortDir, handleSort)}
                    {headerCell('50%', 'p50', sortKey, sortDir, handleSort)}
                    {headerCell('75%', 'p75', sortKey, sortDir, handleSort)}
                    {headerCell('Max', 'max', sortKey, sortDir, handleSort)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRows.map((r) => (
                    <TableRow key={r.column}>
                      <TableCell
                        className='font-medium min-w-[160px] truncate'
                        title={r.column}
                      >
                        {r.column}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.count)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.mean)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.std)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.min)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.p25)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.p50)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.p75)}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {fmt(r.max)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Missingness */}
          <TabsContent
            value='missing'
            className='mt-3 sm:mt-4 space-y-2 sm:space-y-3'
          >
            {missingByCol.map((m) => (
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
            {missingByCol.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                No missing data detected.
              </p>
            )}
          </TabsContent>

          {/* Insights */}
          <TabsContent value='insights' className='mt-3 sm:mt-4 space-y-2'>
            <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
              <Info className='h-4 w-4' /> Heuristics based on summary stats.
            </div>
            <ul className='space-y-2'>
              {stdRanks.map((s) => (
                <li
                  key={s.column}
                  className='flex flex-wrap items-center justify-between gap-2 rounded-md border p-2 sm:p-3'
                >
                  <div className='flex items-center gap-2 min-w-0'>
                    <Badge variant='outline' className='shrink-0'>
                      High variability
                    </Badge>
                    <span className='font-medium truncate'>{s.column}</span>
                  </div>
                  <span className='text-xs sm:text-sm text-muted-foreground tabular-nums'>
                    std {fmt(s.std)}
                  </span>
                </li>
              ))}
              {stdRanks.length === 0 && (
                <li className='text-sm text-muted-foreground'>
                  Not enough numeric columns for variability insights.
                </li>
              )}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// --- helpers ---
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}
function fmt(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1_000_000)
    return Intl.NumberFormat(undefined, { notation: 'compact' }).format(v);
  if (abs >= 1000) return Intl.NumberFormat().format(v);
  if (abs >= 1) return v.toFixed(2);
  return Number(v).toPrecision(3);
}
function headerCell(label, key, sortKey, sortDir, onClick) {
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
function KPI({ label, value, subtle }) {
  return (
    <div className='rounded-xl border p-2 sm:p-3'>
      <div className='text-[11px] sm:text-xs text-muted-foreground'>
        {label}
      </div>
      <div
        className={`mt-1 text-base sm:text-lg font-semibold tabular-nums ${
          subtle ? 'text-muted-foreground' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}
function maxMissing(missing) {
  const pct = Math.max(0, ...missing.map((m) => m.pct));
  return pct.toFixed(1);
}
function copyToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
  } catch {}
}
function downloadJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'analysis.json';
  a.click();
  URL.revokeObjectURL(url);
}
function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  try {
    return Intl.NumberFormat().format(value);
  } catch {
    return String(value);
  }
}
