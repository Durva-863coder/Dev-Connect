import React from 'react';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-dark-bg text-dark-text overflow-x-hidden">
      


      {/* Navbar header */}
      <Navbar />

      {/* Main page content wrapper */}
      <main className="flex-grow z-10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Minimal sleek footer */}
      <footer className="z-10 border-t border-white/5 bg-dark-bg/60 py-6 text-center text-xs text-dark-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} DevConnect. Built for developers to connect, build portfolios, and net professionally.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
