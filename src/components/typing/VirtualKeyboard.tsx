"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  className?: string;
  onKeyClick?: (key: string) => void;
}

const LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
  ['space']
];

export default function VirtualKeyboard({ activeKey, className, onKeyClick }: VirtualKeyboardProps) {
  const [isCaps, setIsCaps] = useState(false);

  const isKeyActive = (key: string) => {
    if (!activeKey) return false;
    const lowerKey = activeKey.toLowerCase();
    if (key === 'space' && lowerKey === ' ') return true;
    if (key === 'caps' && activeKey === 'CapsLock') return true;
    return key === lowerKey;
  };

  const handleKeyClick = (key: string) => {
    if (key === 'caps') {
      setIsCaps(!isCaps);
      return;
    }
    
    let char = key;
    if (key === 'space') {
      char = ' ';
    } else if (isCaps && key.length === 1 && key.match(/[a-z]/i)) {
      char = key.toUpperCase();
    }
    
    onKeyClick?.(char);
  };

  return (
    <div className={cn("w-full max-w-xl mx-auto flex flex-col gap-1.5 select-none", className)}>
      {LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5 w-full">
          {row.map((key, keyIndex) => {
            const active = isKeyActive(key);
            const isSpecial = ['space', 'caps'].includes(key);
            const displayKey = key === 'space' ? 'SPACE' : (isCaps && !isSpecial ? key.toUpperCase() : key);
            
            return (
              <button
                key={keyIndex}
                onClick={() => handleKeyClick(key)}
                className={cn(
                  "h-9 flex items-center justify-center text-[9px] font-black uppercase transition-all duration-75 border cursor-pointer hover:border-primary/50 active:scale-95 outline-none focus:ring-1 focus:ring-primary/20",
                  active || (key === 'caps' && isCaps)
                    ? "bg-primary text-black border-primary" 
                    : "bg-black text-primary/30 border-primary/10",
                  key === 'space' && "flex-1 max-w-[200px]",
                  key === 'caps' && "w-14",
                  !isSpecial && "w-9 sm:w-10"
                )}
              >
                {key === 'caps' && <ArrowUp className={cn("w-3 h-3 mr-1", isCaps ? "text-black" : "text-primary/30")} />}
                {displayKey}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
