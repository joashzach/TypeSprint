"use client";

import { useState, useEffect } from 'react';
import TypingTest from './TypingTest';
import { generateTypingPassage } from '@/ai/flows/generate-typing-passage';
import { Loader2 } from 'lucide-react';

export default function TypingTestWrapper() {
  const [passage, setPassage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPassage = async () => {
    setIsLoading(true);
    try {
      const result = await generateTypingPassage({ wordCount: 60 });
      setPassage(result.passage);
    } catch (error) {
      console.error('Error generating passage:', error);
      setPassage("The quick brown fox jumps over the lazy dog. This is a fallback passage in case our AI systems are temporarily overwhelmed. Continue typing to test your speed and accuracy in the meantime.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassage();
  }, []);

  const handleRestart = () => {
    fetchPassage();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
        <p className="text-lg font-medium text-primary animate-pulse">Generating your custom typing challenge...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <TypingTest passage={passage} onRestart={handleRestart} />
    </div>
  );
}