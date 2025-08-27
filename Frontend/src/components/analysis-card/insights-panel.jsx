'use client';

import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { fmt } from './utils/stats';

export default function InsightsPanel({ insights }) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
        <Info className='h-4 w-4' /> Heuristics from summary stats (no raw rows
        required).
      </div>

      <InsightGroup title='High variability (by CV)'>
        {insights.highVar.length ? (
          insights.highVar.map((r) => (
            <InsightRow
              key={`hv-${r.column}`}
              label={r.column}
              value={`CV ${(r.cv * 100).toFixed(1)}%`}
            />
          ))
        ) : (
          <EmptyInsight text='Not enough numeric columns.' />
        )}
      </InsightGroup>

      <InsightGroup title='Near-constant columns (low spread)'>
        {insights.nearConst.length ? (
          insights.nearConst.map((r) => (
            <InsightRow
              key={`nc-${r.column}`}
              label={r.column}
              value={`std ${fmt(r.std)} • IQR ${fmt(r.iqr)}`}
            />
          ))
        ) : (
          <EmptyInsight text='No near-constant numeric columns detected.' />
        )}
      </InsightGroup>

      <InsightGroup title='Skewed distributions (by quartiles)'>
        {insights.skewed.length ? (
          insights.skewed.map((r) => (
            <InsightRow
              key={`sk-${r.column}`}
              label={r.column}
              value={r.skewHint}
            />
          ))
        ) : (
          <EmptyInsight text='No strong skew hints detected.' />
        )}
      </InsightGroup>

      <InsightGroup title='Widest ranges'>
        {insights.wideRange.length ? (
          insights.wideRange.map((r) => (
            <InsightRow
              key={`wr-${r.column}`}
              label={r.column}
              value={`range ${fmt(r.range)}`}
            />
          ))
        ) : (
          <EmptyInsight text='No wide-range numeric columns detected.' />
        )}
      </InsightGroup>
    </div>
  );
}

function InsightGroup({ title, children }) {
  return (
    <div className='space-y-2'>
      <h4 className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
        {title}
      </h4>
      <ul className='space-y-2'>{children}</ul>
    </div>
  );
}

function InsightRow({ label, value }) {
  return (
    <li className='flex flex-wrap items-center justify-between gap-2 rounded-md border p-2 sm:p-3'>
      <div className='flex items-center gap-2 min-w-0'>
        <Badge variant='outline' className='shrink-0' />
        <span className='font-medium truncate'>{label}</span>
      </div>
      <span className='text-xs sm:text-sm text-muted-foreground tabular-nums'>
        {value}
      </span>
    </li>
  );
}

function EmptyInsight({ text }) {
  return <li className='text-sm text-muted-foreground'>{text}</li>;
}
