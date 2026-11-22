import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

describe('dashboard typography', () => {
  it('uses one system font token for dashboard and chart text', () => {
    const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8');

    assert.match(css, /--dashboard-font-family:\s*system-ui/);
    assert.match(css, /\.dashboard-typography\s*\{/);
    assert.match(css, /\.dashboard-typography\s+\*/);
  });

  it('has no Poppins overrides in dashboard widgets', () => {
    const files = [
      './Components/Dashboard/SubscriptionRenewalAlert.jsx',
      './Components/Dashboard/SupportTickets.jsx',
    ].map((file) => readFileSync(new URL(file, import.meta.url), 'utf8'));

    for (const source of files) {
      assert.doesNotMatch(source, /Poppins/);
    }
  });
});
