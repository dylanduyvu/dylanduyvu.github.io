// Internal production helper, not part of the V5 method API. It only validates and extracts the named ledger table.
const HEADER = '| ID | Recording @ time | Status | Input | Type | Destination | History | Demo | Shortcut | Evidence | Context / cleanup |';
const SEPARATOR = '|---|---|---|---|---|---|---|---|---|---|---|';
const START = '## Merged clean event ledger';
const END = '## Retired batch-1 candidates';

export function parseLedgerTableInternal(markdown) {
  const lines = markdown.split('\n');
  const starts = lines.flatMap((line, index) => line === START ? [index] : []);
  const ends = lines.flatMap((line, index) => line === END ? [index] : []);
  if (starts.length !== 1 || ends.length !== 1 || starts[0] >= ends[0]) throw new Error('Canonical ledger heading boundaries are invalid');
  const [start, end] = [starts[0], ends[0]];
  if (lines[start + 1] !== '' || lines[end - 1] !== '') throw new Error('Canonical ledger table topology is invalid');
  if (lines[start + 2] !== HEADER) throw new Error('Canonical ledger must use the exact eleven-column header');
  if (lines[start + 3] !== SEPARATOR) throw new Error('Canonical ledger separator is invalid');
  const body = lines.slice(start + 4, end - 1);
  if (body.length !== 220) throw new Error(`Canonical ledger must contain exactly 220 body rows; got ${body.length}`);
  for (const line of body) {
    if (!line.startsWith('|') || !line.endsWith('|')) throw new Error('Ledger row must be a Markdown table row');
    if (line.slice(1, -1).split('|').length !== 11) throw new Error('Ledger row must contain exactly eleven cells');
  }
  return body;
}
