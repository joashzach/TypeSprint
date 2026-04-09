"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import LiveMetrics from './LiveMetrics';
import ResultsSummary from './ResultsSummary';
import { RefreshCcw, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingTestProps {
  passage: string;
  onRestart: () => void;
}

export type TestStats = {
  wpm: number;
  accuracy: number;
  errors: number;
  timeSpent: number;
  correctChars: number;
  totalCharsTyped: number;
};

export default function TypingTest({ passage, onRestart }: TypingTestProps) {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [errorsCount, setErrorsCount] = useState(0);
  const [isErrorFlash, setIsErrorFlash] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateWPM = useCallback((input: string, timeSeconds: number) => {
    if (timeSeconds <= 0) return 0;
    const words = input.length / 5;
    const minutes = timeSeconds / 60;
    return Math.round(words / minutes);
  }, []);

  const calculateAccuracy = useCallback((input: string) => {
    const totalTyped = input.length + errorsCount;
    if (totalTyped === 0) return 100;
    return Math.round((input.length / totalTyped) * 100);
  }, [errorsCount]);

  const endTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setEndTime(Date.now());
    setIsFinished(true);
  }, []);

  useEffect(() => {
    if (startTime && !isFinished && !endTime) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished, endTime, endTest]);

  // Scroll to keep current character in view
  useEffect(() => {
    const currentSpan = document.getElementById(`char-${userInput.length}`);
    if (currentSpan) {
      currentSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [userInput]);

  const processInput = useCallback((char: string) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const expectedChar = passage[userInput.length];

    if (char === expectedChar) {
      setUserInput(prev => {
        const next = prev + char;
        if (next.length === passage.length) {
          endTest();
        }
        return next;
      });
      setIsErrorFlash(false);
    } else {
      setErrorsCount(prev => prev + 1);
      setIsErrorFlash(true);
      setTimeout(() => setIsErrorFlash(false), 200);
    }
  }, [isFinished, startTime, passage, userInput.length, endTest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length < userInput.length) {
      setUserInput(value);
      setIsErrorFlash(false);
      return;
    }
    const lastCharTyped = value[value.length - 1];
    processInput(lastCharTyped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === 'R') {
      handleRestart();
    }
  };

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(60);
    setIsFinished(false);
    setErrorsCount(0);
    setIsErrorFlash(false);
    onRestart();
  };

  if (isFinished) {
    const timeSpent = 60 - timeLeft;
    const stats: TestStats = {
      wpm: calculateWPM(userInput, timeSpent),
      accuracy: calculateAccuracy(userInput),
      errors: errorsCount,
      timeSpent,
      correctChars: userInput.length,
      totalCharsTyped: userInput.length + errorsCount,
    };
    return <ResultsSummary stats={stats} onRestart={handleRestart} />;
  }

  const currentWpm = calculateWPM(userInput, 60 - timeLeft);
  const currentAccuracy = calculateAccuracy(userInput);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col bg-background">
      {/* Stats bar */}
      <div className="flex items-center justify-between py-4 px-4 border-b border-primary/10 shrink-0 mb-8 sticky top-16 bg-background/95 backdrop-blur-md z-[100]">
        <LiveMetrics
          wpm={currentWpm}
          accuracy={currentAccuracy}
          timeLeft={timeLeft}
          errors={errorsCount}
        />

        <button
          onClick={handleRestart}
          className="flex items-center gap-2 w-24 h-16 justify-center bg-card border border-primary/15 rounded-sm px-3 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-150"
        >
          <RefreshCcw className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Reset</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 px-4 pb-8">
        <div className={cn(
          "w-full max-w-4xl flex flex-col gap-8 transition-all duration-300",
          isErrorFlash && "animate-shake"
        )}>
          {/* Error flash bar */}
          <div className={cn(
            "fixed top-0 left-0 w-full h-1 z-[110] transition-all duration-200",
            isErrorFlash ? "bg-destructive shadow-[0_4px_20px_rgba(239,68,68,0.6)]" : "bg-transparent"
          )} />

          {/* Typing area */}
          <div
            className="relative cursor-text bg-card border border-primary/15 rounded-sm shadow-[0_2px_16px_rgba(0,0,0,0.3)]"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Error label */}
            <div className={cn(
              "absolute -top-8 left-0 transition-all duration-300 flex items-center gap-2",
              isErrorFlash ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            )}>
              <ShieldAlert className="w-3 h-3 text-destructive" />
              <span className="text-[9px] font-semibold uppercase text-destructive tracking-[0.15em]">
                Wrong key — keep going
              </span>
            </div>

            <div className="p-5 md:p-8">
              <div className="text-2xl md:text-3xl leading-relaxed tracking-wide select-none text-left font-normal"
                style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
                {passage.split('').map((char, i) => {
                  const isTyped = i < userInput.length;
                  const isCurrent = i === userInput.length;

                  let className = "char-untyped";
                  if (isTyped) className = "char-correct";
                  if (isCurrent) className = "char-current";

                  return (
                    <span
                      key={i}
                      id={`char-${i}`}
                      className={cn(
                        className,
                        isCurrent && isErrorFlash && "char-incorrect text-destructive inline-block"
                      )}
                    >
                      {isCurrent && <span className="typing-cursor" />}
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 opacity-0 cursor-default resize-none pointer-events-none"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
