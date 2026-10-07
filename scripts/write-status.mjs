// Playwright JSON raporundan sitenin okuduğu site/test-status.json dosyasını üretir.
import { readFile, writeFile, access } from 'node:fs/promises';

const raw = JSON.parse(await readFile('reports/results.json', 'utf8'));
const s = raw.stats;
const env = process.env;
const hasReport = await access('site/report/index.html').then(() => true, () => false);

// Terminaldeki `npm test` komutu için test listesi: t = başlık, p = proje, s = durum, d = süre (ms)
const tests = [];
(function walk(suites, path) {
  for (const suite of suites || []) {
    const here = suite.file === suite.title ? path : [...path, suite.title];
    for (const spec of suite.specs || []) {
      for (const t of spec.tests) {
        if (t.status === 'skipped') continue;
        const last = t.results[t.results.length - 1];
        tests.push({ t: [...here, spec.title].join(' › '), p: t.projectName, s: t.status, d: last ? last.duration : 0 });
      }
    }
    walk(suite.suites, here);
  }
})(raw.suites, []);

const status = {
  passed: s.expected + s.flaky,
  failed: s.unexpected,
  flaky: s.flaky,
  skipped: s.skipped,
  total: s.expected + s.flaky + s.unexpected,
  durationMs: Math.round(s.duration),
  finishedAt: new Date().toISOString(),
  commit: env.GITHUB_SHA ? env.GITHUB_SHA.slice(0, 7) : null,
  runUrl: env.GITHUB_RUN_ID ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : null,
  reportUrl: hasReport ? 'report/' : null,
  tests
};

await writeFile('site/test-status.json', JSON.stringify(status, null, 2) + '\n');
console.log(`test-status.json: ${status.passed}/${status.total} geçti, ${status.failed} başarısız`);
if (status.failed > 0) process.exitCode = 1;
