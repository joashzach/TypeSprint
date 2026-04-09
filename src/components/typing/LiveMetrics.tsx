import React from 'react';

interface LiveMetricsProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  errors: number;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 w-24 h-16 bg-card border border-primary/15 rounded-sm px-3">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground leading-none">
        {label}
      </p>
      <p className="text-xl font-bold tabular-nums tracking-tight text-foreground leading-none">
        {value}
      </p>
    </div>
  );
}

export default function LiveMetrics({ wpm, accuracy, timeLeft, errors }: LiveMetricsProps) {
  return (
    <div className="flex items-center gap-2">
      <MetricCard label="Time" value={`${timeLeft}s`} />
      <MetricCard label="WPM" value={wpm.toString()} />
      <MetricCard label="Accuracy" value={`${accuracy}%`} />
      <MetricCard label="Errors" value={errors.toString()} />
    </div>
  );
}
