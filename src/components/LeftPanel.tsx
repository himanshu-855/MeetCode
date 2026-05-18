import React from 'react';

export function LeftPanel() {
  return (
    <div className="h-full flex flex-col bg-card overflow-y-auto border-r border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <h1 className="text-2xl font-semibold">Maximum Element From an Array</h1>
      </div>
      
      <div className="mb-6">
        <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full">
          Easy
        </span>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-muted-foreground space-y-6">
        <p className="text-base text-foreground">
          Given an array of integers, return the maximum element present in the array.
        </p>

        <div>
          <h3 className="text-foreground font-medium mb-2">Input Format:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>First line contains integer n</li>
            <li>Second line contains n space separated integers</li>
          </ul>
        </div>

        <div>
          <h3 className="text-foreground font-medium mb-2">Output Format:</h3>
          <p>Print the maximum element.</p>
        </div>

        <div>
          <h3 className="text-foreground font-medium mb-2">Example:</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm">
            <div className="mb-2">
              <span className="text-muted-foreground select-none">Input:</span>
              <br />
              5<br />
              1 7 3 9 2
            </div>
            <div>
              <span className="text-muted-foreground select-none">Output:</span>
              <br />
              9
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-foreground font-medium mb-2">Constraints:</h3>
          <ul className="list-disc pl-5 space-y-1 font-mono text-sm">
            <li>1 &lt;= n &lt;= 100000</li>
            <li>-10^9 &lt;= arr[i] &lt;= 10^9</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
