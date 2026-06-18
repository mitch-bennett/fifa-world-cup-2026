import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main-shell">
        <Outlet />
      </main>
    </div>
  );
}
