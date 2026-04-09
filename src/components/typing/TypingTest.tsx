"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import LiveMetrics from './LiveMetrics';
import ResultsSummary from './ResultsSummary';
import VirtualKeyboard from './VirtualKeyboard';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ShieldAlert, Eye, EyeOff } from 'lucide-react';
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
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
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

  // Handle page scrolling to keep the current character in view
  useEffect(() => {
    const currentSpan = document.getElementById(`char-${userInput.length}`);
    if (currentSpan) {
      currentSpan.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
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

  const handleVirtualKeyClick = (key: string) => {
    processInput(key);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setPressedKey(e.key);
    if (e.shiftKey && e.key === 'R') {
      handleRestart();
    }
  };

  const handleKeyUp = () => {
    setPressedKey(null);
  };

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(60);
    setIsFinished(false);
    setErrorsCount(0);
    setPressedKey(null);
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
      totalCharsTyped: userInput.length + errorsCount
    };

    return <ResultsSummary stats={stats} onRestart={handleRestart} />;
  }

  const currentWpm = calculateWPM(userInput, 60 - timeLeft);
  const currentAccuracy = calculateAccuracy(userInput);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col bg-background">
      <div className="flex items-center justify-between py-6 px-4 border-b border-primary/10 shrink-0 mb-8 sticky top-0 bg-background/90 backdrop-blur-md z-[100]">
        <div className="flex items-center gap-12">
          <LiveMetrics 
            wpm={currentWpm} 
            accuracy={currentAccuracy} 
            timeLeft={timeLeft} 
          />
        </div>
        
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="text-primary/40 hover:text-primary transition-colors h-8"
          >
            {showKeyboard ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            <span className="text-[10px] font-black uppercase">HUD</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRestart} 
            className="border-primary/20 text-primary hover:bg-primary hover:text-foreground rounded-none h-8"
          >
            <RefreshCcw className="w-3 h-3 mr-2" />
            <span className="text-[10px] font-black uppercase">Reset</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 px-4 pb-48">
        <div className={cn(
          "w-full max-w-4xl flex flex-col gap-8 transition-all duration-300",
          isErrorFlash && "animate-shake"
        )}>
          <div className={cn(
            "fixed top-0 left-0 w-full h-1.5 z-[110] transition-all duration-200",
            isErrorFlash ? "bg-destructive shadow-[0_4px_30px_rgba(239,68,68,0.8)]" : "bg-transparent"
          )} />

          {showKeyboard && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <VirtualKeyboard 
                activeKey={pressedKey} 
                className="opacity-70 scale-95" 
                onKeyClick={handleVirtualKeyClick}
              />
            </div>
          )}

          <div 
            className="relative cursor-text clean-frame min-h-[400px]"
            onClick={() => inputRef.current?.focus()}
          >
            <div className={cn(
              "absolute -top-10 left-0 transition-all duration-300 flex items-center gap-2",
              isErrorFlash ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}>
              <ShieldAlert className="w-3 h-3 text-destructive" />
              <span className="text-[9px] font-black uppercase text-destructive tracking-[0.2em]">Input Error: Correction Required</span>
            </div>

            <div className="p-10">
              <div className="text-3xl md:text-4xl leading-[1.8] font-mono-typing tracking-tight select-none text-left font-medium">
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
              onKeyUp={handleKeyUp}
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
