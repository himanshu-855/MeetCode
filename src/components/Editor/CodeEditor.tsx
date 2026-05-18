import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ language, code, onChange }: CodeEditorProps) {
  return (
    <div className="w-full h-full flex flex-col bg-card">
      <div className="flex-1 overflow-hidden pt-2">
        <Editor
          height="100%"
          language={language === 'c++' ? 'cpp' : language}
          value={code}
          theme="vs-dark"
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          }}
        />
      </div>
    </div>
  );
}
