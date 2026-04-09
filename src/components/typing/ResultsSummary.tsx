"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Copy, Check, Share2 } from 'lucide-react';
import type { TestStats } from './TypingTest';

interface ResultsSummaryProps {
  stats: TestStats;
  onRestart: () => void;
}

const SITE_URL = 'https://typesprint.app';

function buildShareText(stats: TestStats): string {
  return `🚀 TypeSprint Results\nWPM: ${stats.wpm}\nAccuracy: ${stats.accuracy}%\nTime: ${stats.timeSpent}s\nErrors: ${stats.errors}\nTry: ${SITE_URL}`;
}

function ResultBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-6 flex flex-col gap-2 border transition-all ${
        highlight ? 'border-primary/30 bg-primary/8' : 'border-primary/10'
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-widest ${
          highlight ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        {label}
      </p>
      <p className={`text-4xl font-bold tracking-tight tabular-nums ${highlight ? 'text-foreground' : 'text-foreground/70'}`}>
        {value}
      </p>
    </div>
  );
}

export default function ResultsSummary({ stats, onRestart }: ResultsSummaryProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(stats));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = buildShareText(stats);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const text = buildShareText(stats);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'TypeSprint Results', text, url: SITE_URL });
        return;
      } catch {
        // user cancelled or not supported — fall through to social links
      }
    }
    // Fallback: open WhatsApp
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const performance =
    stats.accuracy === 100
      ? 'Perfect accuracy. Push your speed further.'
      : `${stats.errors} error${stats.errors !== 1 ? 's' : ''} — recalibrate and try again.`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 clean-frame">
      {/* Header */}
      <div className="border-b border-primary/20 pb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Session Complete
        </p>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">Results</h2>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <ResultBox label="WPM" value={stats.wpm} highlight />
        <ResultBox label="Accuracy" value={`${stats.accuracy}%`} highlight />
        <ResultBox label="Errors" value={stats.errors} />
        <ResultBox label="Time" value={`${stats.timeSpent}s`} />
      </div>

      {/* Feedback */}
      <p className="text-sm font-medium leading-relaxed text-muted-foreground border-l-2 border-primary/40 pl-4">
        {performance}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          size="lg"
          onClick={onRestart}
          className="flex-1 h-12 rounded-none bg-primary hover:bg-primary/80 text-foreground font-bold uppercase tracking-wider transition-all"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={handleCopy}
          className="flex-1 h-12 rounded-none border border-primary/30 text-primary font-bold uppercase tracking-wider hover:bg-primary/10 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Results
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={handleShare}
          className="flex-1 h-12 rounded-none border border-primary/30 text-primary font-bold uppercase tracking-wider hover:bg-primary/10 transition-all"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
