/** site/test-status.json şeması — scripts/write-status.mjs bunu üretir, site bunu okur. */
export type CaseState = 'expected' | 'unexpected' | 'flaky' | 'skipped';

export interface TestCaseResult {
  /** başlık yolu, ör. "Bug hunt › starts" */
  t: string;
  /** Playwright projesi: desktop | mobile */
  p: string;
  s: CaseState;
  /** süre (ms) */
  d: number;
}

export interface TestStatus {
  passed: number;
  failed: number;
  total: number;
  flaky?: number;
  skipped?: number;
  durationMs?: number;
  finishedAt?: string;
  reportUrl?: string | null;
  runUrl?: string | null;
  tests?: TestCaseResult[];
}

const HOUR = 3_600_000;

/** Varsayılanı yeşil bir koşu olan test verisi fabrikası. */
export function aStatus(overrides: Partial<TestStatus> = {}): TestStatus {
  return {
    passed: 42,
    failed: 0,
    total: 42,
    durationMs: 1_500,
    finishedAt: new Date().toISOString(),
    ...overrides
  };
}

export const hoursAgo = (h: number): string => new Date(Date.now() - h * HOUR).toISOString();
