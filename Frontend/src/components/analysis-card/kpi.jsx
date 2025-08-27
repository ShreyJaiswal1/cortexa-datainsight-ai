'use client';

export default function KPI({ label, value, subtle }) {
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
