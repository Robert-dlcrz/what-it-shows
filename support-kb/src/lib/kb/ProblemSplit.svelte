<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  const noteOrder = notes.oneDayMove;
  const oneDay = new Set(noteOrder);

  const rows = $derived.by(() => {
    const merged = uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket);
    const buckets = new Map<string, Report[]>();
    for (const r of merged) {
      const kind = oneDay.has(r.id) ? 'one-day' : (causeOf(r, tenantOf(r)) ?? 'unplaced');
      buckets.set(kind, [...(buckets.get(kind) ?? []), r]);
    }
    const moved = buckets.get('one-day');
    if (moved) {
      moved.sort((a, b) => noteOrder.indexOf(a.id) - noteOrder.indexOf(b.id));
    }
    const spec = [
      ['parser', 'Day-first dates read month-first', 'cause parser, and not in the one-day desk notes'],
      ['hint', 'Form hint says month-first, form reads day-first', 'cause hint: form channel on booking-v3'],
      ['one-day', 'Read as a one-day move', 'id listed in desk-notes.json oneDayMove'],
      ['unplaced', 'No cause for this tenant', 'tenant missing, or the locale is not day-first'],
    ] as const;
    const groups = spec
      .filter(([kind]) => (buckets.get(kind)?.length ?? 0) > 0)
      .map(([kind, label, rule]) => ({
        kind,
        label,
        rule,
        reports: buckets.get(kind) ?? [],
      }));
    return { total: merged.length, groups };
  });
</script>

<p class="sum">
  <strong>{rows.total}</strong> reports merged into #{ticket}, split into
  <strong>{rows.groups.length}</strong>
  {rows.groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>how the count is made</th></tr>
  </thead>
  <tbody>
    {#each rows.groups as g (g.kind)}
      <tr>
        <td>{g.label}</td>
        <td><strong>{g.reports.length}</strong></td>
        <td class="rule">{g.rule}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each rows.groups as g (g.kind)}
  {#if g.kind === 'one-day'}
    <p class="note">
      {g.reports.map((r) => r.id).join(', ')}. Filed under the tenant's cause, counted here instead.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .rule { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
