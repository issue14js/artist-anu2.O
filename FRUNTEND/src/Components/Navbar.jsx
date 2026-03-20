import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Menu, X, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAdmin = user && (user.isAdmin === true || user.role === 'admin');

  return (
    <nav className="fixed w-full bg-transparent text-white backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl text-white font-serif font-bold text-primary">
          
          <span className='text-white'>Artist-Annuradha</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="hover:text-accent transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}

          {/* Admin Link */}
          {isAdmin && (
            <Link 
              to="/admin/messages"
              className="hover:text-accent text-sm transition-colors duration-300 px-3 py-1 rounded-full border  hover:bg-accent/10"
              title="Admin Messages"
            >
              📬 
            </Link>
          )}
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-4 ml-4">
            {user ? (
              <Link 
                to="/profile"
                className="w-7 h-7 rounded-full overflow-hidden border-2 border-accent hover:border-accent/80 transition-colors flex items-center justify-center bg-accent/10"
                title={user?.name}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-accent" />
                )}
              </Link>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-2 bg-accent hover:bg-accent/80 rounded transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-transparent border-t p-4 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block hover:text-accent font-medium"
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Admin Link */}
          {isAdmin && (
            <Link 
              to="/admin/messages"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 hover:text-accent font-medium border border-accent/50 rounded text-center hover:bg-accent/10"
            >
              📬 Messages
            </Link>
          )}
          
          {/* Mobile Auth Section */}
          <div className="border-t pt-4 mt-4 space-y-2">
            {user ? (
              <Link 
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex justify-center"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent hover:border-accent/80 transition-colors flex items-center justify-center bg-accent/10">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-accent" />
                  )}
                </div>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:text-accent font-medium text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-accent hover:bg-accent/80 rounded transition-colors text-center font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;