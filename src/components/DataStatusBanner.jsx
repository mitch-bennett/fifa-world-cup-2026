import useDataStatus from '../hooks/useDataStatus';

export default function DataStatusBanner() {
  const status = useDataStatus();
  const isSample = status.status === 'sample';

  return (
    <section className={`data-status${isSample ? ' sample' : ' official'}`} role="note" aria-live="polite">
      <strong>Data status:</strong> {status.status.toUpperCase()} • {status.source} • Updated {status.lastUpdated}
      <span> — {status.notes}</span>
    </section>
  );
}
