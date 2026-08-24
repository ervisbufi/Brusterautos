import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div id="app-layout" className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col selection:bg-[#B91C1C]/30 selection:text-black">
      <ScrollRestoration />
      <Navbar />
      <main id="main-content" className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
