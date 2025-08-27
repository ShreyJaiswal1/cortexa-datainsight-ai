'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Download, BarChart3, Wand2 } from 'lucide-react';

import SummaryTable from './summary-table';
import MissingPanel from './missing-panel';
import InsightsPanel from './insights-panel';
import KPI from './kpi';
import { buildSummary } from './utils/stats';

export function AnalysisCard({ analysisData }) {
  const [sortKey, setSortKey] = useState('column');
  const [sortDir, setSortDir] = useState('asc');

  const summary = useMemo(() => buildSummary(analysisData), [analysisData]); // builds rows, insights, etc. :contentReference[oaicite:0]{index=0}
  if (!analysisData) return null;

  const {
    columns,
    nRows,
    numericCount,
    rowsSumm,
    missingByCol,
    overallMissingPct,
    insights,
  } = summary;

    return (
      <>
        <Card className='w-full overflow-hidden dark:bg-gray-800/80'>
          <CardHeader className='pb-2'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <CardTitle className='flex items-center gap-2 text-sm sm:text-base'>
                  <BarChart3 className='h-4 w-4 text-primary shrink-0' />
                  <span className='truncate'>Dataset Overview</span>
                </CardTitle>
                <CardDescription className='mt-1 text-xs sm:text-sm'>
                  Quick summary generated from your uploaded file.
                </CardDescription>
              </div>
              <div className='shrink-0 flex items-center gap-2'>
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
              </div>
            </div>

            {/* KPIs */}
            <div className='mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3'>
              <KPI label='Rows' value={formatNumber(nRows)} />
              <KPI label='Columns' value={columns.length} />
              <KPI label='Numeric cols' value={numericCount} />
              <KPI
                label='Completeness'
                value={`${Math.max(0, 100 - overallMissingPct).toFixed(1)}%`}
                subtle
              />
            </div>
          </CardHeader>

          <CardContent className='min-w-0'>
            <Tabs defaultValue='table' className='w-full'>
              <TabsList className='grid grid-cols-3 w-full'>
                <TabsTrigger value='table'>Summary</TabsTrigger>
                <TabsTrigger value='missing'>Missing</TabsTrigger>
                <TabsTrigger value='insights'>Insights</TabsTrigger>
              </TabsList>

              <TabsContent value='table' className='mt-3 sm:mt-4'>
                <SummaryTable
                  rows={rowsSumm}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={setSortKey}
                  onFlipDir={() =>
                    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
                  }
                />
              </TabsContent>

              <TabsContent value='missing' className='mt-3 sm:mt-4'>
                <MissingPanel items={missingByCol} />
              </TabsContent>

              <TabsContent value='insights' className='mt-3 sm:mt-4'>
                <InsightsPanel insights={insights} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className='mt-3 flex justify-end'>
          <Button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('cortexa:visualize', { detail: { bins: 20 } })
              );
            }}
            className='gap-2'
            variant='default'
          >
            <Wand2 className='h-4 w-4' />
            <span className='hidden sm:inline'>Visualize</span>
          </Button>
        </div>
      </>
    );
}

/* local utils kept here to avoid extra imports */
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
function formatNumber(v) {
  if (v == null) return '—';
  try {
    return Intl.NumberFormat().format(v);
  } catch {
    return String(v);
  }
}

export default AnalysisCard;
