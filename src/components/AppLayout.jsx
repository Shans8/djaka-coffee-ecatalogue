import { useState } from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

function AppLayout({ role, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
      <div className={`overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <main className="main-content">
        <Navbar title={title} onToggle={() => setOpen(true)} />
        <section className="content-area">{children}</section>
      </main>
    </div>
  );
}

export default AppLayout;
