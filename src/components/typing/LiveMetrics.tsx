import React from 'react';

interface LiveMetricsProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
}

export default function LiveMetrics({ wpm, accuracy, timeLeft }: LiveMetricsProps) {
  return (
    <div className="flex items-center gap-8">
      <MetricItem label="Time" value={`${timeLeft}s`} />
      <MetricItem label="WPM" value={wpm.toString()} />
      <MetricItem label="ACC" value={`${accuracy}%`} />
    </div>
  );
}

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0">
      <p className="text-[9px] font-black uppercase tracking-widest text-primary/40">{label}</p>
      <p className="text-xl font-black tabular-nums tracking-tighter text-primary uppercase italic">{value}</p>
    </div>
  );
}
