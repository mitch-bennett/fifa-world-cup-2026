export default function LoadingState({ label = 'Loading page...' }) {
  return (
    <section className="card loading-card" role="status" aria-live="polite">
      <p className="empty">{label}</p>
    </section>
  );
}
