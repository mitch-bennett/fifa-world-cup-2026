import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="card">
      <h2>404</h2>
      <p>This route does not exist in the tournament map.</p>
      <Link className="pill-link" to="/">
        Return to globe
      </Link>
    </section>
  );
}
