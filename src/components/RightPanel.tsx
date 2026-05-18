import React from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { CodeEditor } from './Editor/CodeEditor';
import { Console } from './Terminal/Console';
import { StandardizedResult } from '@/lib/types/execution';
import { Settings, Code2 } from 'lucide-react';

interface RightPanelProps {
  language: string;
  setLanguage: (lang: string) => void;
  code: string;
  setCode: (code: string) => void;
  customInput: string;
  setCustomInput: (input: string) => void;
  onRun: () => void;
  isRunning: boolean;
  result: StandardizedResult | null;
}

export function RightPanel({
  language,
  setLanguage,
  code,
  setCode,
  customInput,
  setCustomInput,
  onRun,
  isRunning,
  result
}: RightPanelProps) {
  return (
    <div className="h-full flex flex-col bg-card">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-[#1e1e1e]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">Code</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-secondary text-secondary-foreground text-sm rounded-md px-3 py-1.5 border-none focus:ring-1 focus:ring-ring outline-none"
          >
            <option value="c++">C++</option>
            <option value="python">Python</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <PanelGroup orientation="vertical" className="min-h-0">
          <Panel defaultSize={70} minSize={30} className="min-h-0">
            <CodeEditor
              language={language}
              code={code}
              onChange={(val) => setCode(val || '')}
            />
          </Panel>
          
          <PanelResizeHandle className="h-2 bg-background border-y border-border hover:bg-emerald-500/20 transition-colors flex items-center justify-center cursor-row-resize">
            <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
          </PanelResizeHandle>
          
          <Panel defaultSize={30} minSize={20} className="min-h-0">
            <Console
              customInput={customInput}
              setCustomInput={setCustomInput}
              onRun={onRun}
              isRunning={isRunning}
              result={result}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
