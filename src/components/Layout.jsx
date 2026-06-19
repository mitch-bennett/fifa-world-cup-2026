import { Outlet } from 'react-router-dom';
import DataStatusBanner from './DataStatusBanner';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main-shell">
        <DataStatusBanner />
        <Outlet />
      </main>
    </div>
  );
}
