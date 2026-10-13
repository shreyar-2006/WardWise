import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useReports } from '../context/ReportsContext';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { persistenceWarning } = useReports();

  return (
    <div className="app-frame">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="WardWise home" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">W</span>
            <span className="brand-copy"><strong>WardWise</strong><small>Community issue tracker</small></span>
          </Link>
          <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            <NavLink end to="/" onClick={() => setMenuOpen(false)}>Overview</NavLink>
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Manage reports</NavLink>
            <Link className="nav-report-link" to="/reports/new" onClick={() => setMenuOpen(false)}>Report an issue <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="page-content">
        {persistenceWarning && <div className="storage-notice" role="status">{persistenceWarning}</div>}
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner"><span>WardWise <span aria-hidden="true">·</span> Community prototype</span><p>Reports are stored locally in this browser and are not submitted to municipal authorities.</p></div>
      </footer>
      <a className="skip-link" href="#main-content">Skip to content</a>
    </div>
  );
}
