'use client';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@clerk/nextjs';

export default function ChartAnalysis({ data, columns = [] }) {
  const [chartData, setChartData] = useState(data);
  const [selectedCol, setSelectedCol] = useState(
    data?.column || columns[0] || ''
  );
  const [hoverIdx, setHoverIdx] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
  const { getToken } = useAuth();

  async function authHeaders() {
    try {
      const token = await getToken({ template: 'backend' });
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }

  useEffect(() => {
    if (!selectedCol) return;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/data/histogram/?col=${encodeURIComponent(
            selectedCol
          )}&bins=20`,
          { headers: await authHeaders() }
        );
        const json = await res.json();
        setChartData(json);
        setHoverIdx(null);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedCol, API_BASE]);

  if (!chartData?.bins || !chartData?.counts) {
    return <p className='text-sm text-muted-foreground'>No chart data.</p>;
  }

  const { bins, counts, column } = chartData;

  const W = 720,
    H = 300,
    PAD = 40;
  const innerW = W - PAD * 2;
  const maxCount = Math.max(1, ...counts);
  const barW = innerW / counts.length;

  const formatEdge = (v) => {
    const abs = Math.abs(v);
    if (abs >= 1_000_000)
      return Intl.NumberFormat(undefined, { notation: 'compact' }).format(v);
    if (abs >= 1_000) return Intl.NumberFormat().format(v);
    if (abs >= 1) return Number(v).toFixed(2);
    return Number(v).toPrecision(3);
  };

  const bubble = (() => {
    if (hoverIdx == null) return null;
    const count = counts[hoverIdx];
    const h = (count / maxCount) * (H - PAD * 2);
    const cx = PAD + hoverIdx * barW + barW / 2;
    const topY = H - PAD - h;

    const bw = 160;
    const bh = 48;
    const tip = 8;

    // keep bubble inside chart bounds
    const bx = Math.min(Math.max(cx - bw / 2, PAD + 6), W - PAD - bw - 6);
    // prefer above the bar; if too high, place below
    const placeAbove = topY > PAD + bh + tip + 6;
    const by = placeAbove ? topY - bh - tip - 6 : topY + tip + 6;

    const path = placeAbove
      ? `M${bx},${by} h${bw} a8,8 0 0 1 8,8 v${bh - 16} a8,8 0 0 1 -8,8 h${-(
          bw / 2 -
          10
        )}
          l${bw / 2 - 10 - (cx - bx)} ,8 l${-(
          bw / 2 -
          10 -
          (cx - bx)
        )} ,-8 h${-(bw / 2 - 10)}
          a8,8 0 0 1 -8,-8 v${-(bh - 16)} a8,8 0 0 1 8,-8 z`
      : `M${bx},${by} h${bw} a8,8 0 0 1 8,8 v${bh - 16} a8,8 0 0 1 -8,8 h${-(
          bw / 2 -
          10
        )}
          l${bw / 2 - 10 - (cx - bx)} ,-${8} l${-(
          bw / 2 -
          10 -
          (cx - bx)
        )} ,${8} h${-(bw / 2 - 10)}
          a8,8 0 0 1 -8,-8 v${-(bh - 16)} a8,8 0 0 1 8,-8 z`;

    const line1 = `count: ${count}`;
    const line2 = `${formatEdge(bins[hoverIdx])} – ${formatEdge(
      bins[hoverIdx + 1] ?? bins[hoverIdx]
    )}`;
    const tx = bx + bw / 2;
    const ty = by + (placeAbove ? 18 : 26);

    return { path, tx, ty, line1, line2, placeAbove };
  })();

  return (
    <div className='w-full rounded-xl border p-3 sm:p-4 bg-background/60'>
      <div className='mb-2 flex flex-wrap items-center gap-3'>
        <div className='text-sm text-muted-foreground'>
          Histogram —{' '}
          <span className='font-medium text-foreground'>{column}</span>
        </div>
        {columns.length > 1 && (
          <Select value={selectedCol} onValueChange={(v) => setSelectedCol(v)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Choose column' />
            </SelectTrigger>
            <SelectContent>
              {columns.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${W} ${H}`}
        className='w-full'
        preserveAspectRatio='xMidYMid meet'
        style={{ minHeight: 240 }}
      >
        {/* axes */}
        <line
          x1={PAD}
          y1={H - PAD}
          x2={W - PAD}
          y2={H - PAD}
          stroke='currentColor'
          opacity='0.35'
        />
        <line
          x1={PAD}
          y1={PAD}
          x2={PAD}
          y2={H - PAD}
          stroke='currentColor'
          opacity='0.2'
        />

        {/* bars */}
        {counts.map((c, i) => {
          const h = (c / maxCount) * (H - PAD * 2);
          const x = PAD + i * barW;
          const y = H - PAD - h;
          const active = i === hoverIdx;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={Math.max(1, barW - 2)}
              height={h}
              className={active ? 'fill-primary/60' : 'fill-primary/25'}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          );
        })}

        {/* tick labels (first/mid/last) */}
        {[0, Math.floor(bins.length / 2), bins.length - 1].map((idx) => (
          <text
            key={`t-${idx}`}
            x={PAD + (idx / (bins.length - 1)) * innerW}
            y={H - PAD + 16}
            textAnchor='middle'
            className='text-[10px] sm:text-xs fill-current'
          >
            {formatEdge(bins[idx])}
          </text>
        ))}

        {/* SVG bubble tooltip (no HTML divs) */}
        {bubble && (
          <g pointerEvents='none'>
            <path d={bubble.path} className='fill-primary/85' />
            <text
              x={bubble.tx}
              y={bubble.ty}
              textAnchor='middle'
              className='text-[10px] sm:text-xs fill-white font-semibold'
            >
              <tspan x={bubble.tx} dy='0'>
                {bubble.line1}
              </tspan>
              <tspan x={bubble.tx} dy='14'>
                {bubble.line2}
              </tspan>
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
