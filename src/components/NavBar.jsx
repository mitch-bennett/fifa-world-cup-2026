import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Globe' },
  { to: '/groups', label: 'Groups' },
  { to: '/schedule', label: 'Schedule' },
];

export default function NavBar() {
  return (
    <header className="nav-shell">
      <div className="brand">
        <span className="brand-kicker">FIFA 2026</span>
        <h1>World Cup Atlas</h1>
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
