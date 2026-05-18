/**
 * Normalizes program output for fair comparison.
 * - Trims leading/trailing whitespace from the full output
 * - Normalizes Windows-style line endings (\r\n) to Unix (\n)
 * - Trims trailing whitespace from each individual line
 * - Removes trailing empty lines
 */
export function normalizeOutput(output: string): string {
  return output
    .replace(/\r\n/g, '\n')   // Normalize CRLF to LF
    .replace(/\r/g, '\n')      // Normalize stray CR to LF
    .split('\n')
    .map((line) => line.trimEnd()) // Trim trailing spaces on each line
    .join('\n')
    .trim();                   // Trim leading/trailing blank lines
}
