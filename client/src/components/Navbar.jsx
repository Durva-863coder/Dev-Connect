import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FiMenu, FiX, FiUser, FiGrid, FiSearch, FiLogOut, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/login');
    });
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: <FiGrid className="mr-2" /> },
        { name: 'Directory', path: '/directory', icon: <FiSearch className="mr-2" /> },
        { name: 'Settings', path: '/settings', icon: <FiSettings className="mr-2" /> },
      ]
    : [
        { name: 'Directory', path: '/directory', icon: <FiSearch className="mr-2" /> },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-dark-bg/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-white text-xl font-black tracking-tight">
                Dev<span className="text-brand-primary">Connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-white/5 text-white border border-dark-border'
                      : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side auth buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/u/${user?.username}`}
                  className="flex items-center space-x-2 text-dark-text hover:text-brand-accent transition-all"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-brand-primary text-sm font-semibold text-white">
                      {user?.name ? user.name[0] : <FiUser />}
                    </div>
                  )}
                  <span className="text-sm font-medium">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                >
                  <FiLogOut className="mr-1.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-dark-muted hover:text-dark-text px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary hover:to-brand-accent/90 text-white shadow-lg shadow-brand-primary/20 px-4 py-2 rounded-md text-sm font-medium transition-all hover:scale-[1.03] active:scale-[0.98]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-dark-muted hover:bg-white/5 hover:text-dark-text focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-white/5 bg-dark-bg/95 backdrop-blur-lg">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-white/5 text-white border-l-2 border-brand-primary'
                    : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="border-t border-white/5 mt-4 pt-4 pb-2">
                <div className="flex items-center px-3 mb-3">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-10 w-10 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-brand-primary text-base font-semibold text-white">
                      {user?.name ? user.name[0] : <FiUser />}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-dark-text">{user?.name}</div>
                    <div className="text-sm font-medium text-dark-muted">@{user?.username}</div>
                  </div>
                </div>
                <Link
                  to={`/u/${user?.username}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-dark-muted hover:text-dark-text hover:bg-white/5"
                >
                  <FiUser className="mr-2" />
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 mt-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-white/5 mt-4 pt-4 flex flex-col space-y-2 px-3 pb-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center border border-white/10 px-4 py-2 rounded-md text-base font-medium text-dark-text hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-accent text-white px-4 py-2 rounded-md text-base font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
