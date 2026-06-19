import useDataStatus from '../hooks/useDataStatus';

export default function DataStatusBanner() {
  const status = useDataStatus();
  const isSample = status.status === 'sample';
  const isPartial = status.status === 'partial-official';
  const bannerClass = isSample ? 'sample' : isPartial ? 'partial' : 'official';

  return (
    <section className={`data-status ${bannerClass}`} role="note" aria-live="polite">
      <strong>Data status:</strong> {status.status.toUpperCase()} • {status.source} • Updated {status.lastUpdated}
      <span> — {status.notes}</span>
    </section>
  );
}
