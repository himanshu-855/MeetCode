import React, { useState } from 'react';
import { Play, Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { StandardizedResult } from '@/lib/types/execution';
import { cn } from '@/lib/utils';

interface ConsoleProps {
  customInput: string;
  setCustomInput: (val: string) => void;
  onRun: () => void;
  isRunning: boolean;
  result: StandardizedResult | null;
}

export function Console({ customInput, setCustomInput, onRun, isRunning, result }: ConsoleProps) {
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  // Switch to output tab when result comes in or when running
  React.useEffect(() => {
    if (isRunning || result) {
      setActiveTab('output');
    }
  }, [isRunning, result]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-border">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('input')}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === 'input' 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            Custom Input
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === 'output' 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            Output
          </button>
        </div>
        
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span>Run Code</span>
        </button>
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {activeTab === 'input' ? (
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom input here..."
            className="w-full h-full min-h-[100px] bg-transparent resize-none focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        ) : (
          <div className="h-full flex flex-col">
            {isRunning ? (
              <div className="flex items-center justify-center h-full text-muted-foreground space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Executing code...</span>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4 pb-2 border-b border-border/50">
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    result.isError || result.status.toLowerCase().includes('error') ? "bg-destructive/20 text-destructive" : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {result.status}
                  </span>
                  <span>Time: {result.executionTime}s</span>
                  <span>Memory: {result.memory}KB</span>
                </div>
                
                {result.output ? (
                  <pre className={cn(
                    "whitespace-pre-wrap break-all",
                    result.isError ? "text-destructive" : "text-foreground"
                  )}>
                    {result.output}
                  </pre>
                ) : (
                  <span className="text-muted-foreground italic">No output</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
                <TerminalIcon className="w-8 h-8 opacity-20" />
                <span>Run code to see output</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
