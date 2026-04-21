import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogIn, LogOut, User as UserIcon, ShieldAlert, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wider">Noor<span className="text-emerald-300">Blog</span></span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search posts or tags (e.g. Namaz)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-emerald-900/50 text-white placeholder-emerald-200/70 border border-emerald-700 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-emerald-300 hover:text-white">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-emerald-200">
                  <UserIcon size={18} />
                  <span>{user.username}</span>
                  {user.role === 'admin' && <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded-full text-white">Admin</span>}
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1 hover:text-emerald-300 transition">
                    <ShieldAlert size={18} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button onClick={logout} className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-md transition">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-1 hover:text-emerald-300 transition">
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md font-medium transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-emerald-200 hover:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-900 px-4 pt-2 pb-4 space-y-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-800 text-white placeholder-emerald-300 border border-emerald-700 rounded-md py-2 pl-4 pr-10 focus:outline-none"
            />
          </form>
          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <div className="text-emerald-200 font-medium">Welcome, {user.username}</div>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-white">Admin Dashboard</Link>
                )}
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-white">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-white">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
