import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeLinkStyle = {
    backgroundColor: '#0891b2', // cyan-600
    color: 'white',
  };

  const baseLinkStyle = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-white/10";

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <span className="text-white font-bold text-2xl tracking-wider">
            METEOR MADNESS
          </span>
          <span className="text-white font-bold text-lg tracking-wider">
            F-2309
          </span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          <NavLink 
            to="/" 
            className={baseLinkStyle} 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined} 
            end
          >
            Solar System
          </NavLink>
          <NavLink 
            to="/asteroids" 
            className={baseLinkStyle} 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Asteroid Explorer
          </NavLink>
          <NavLink 
            to="/mission" 
            className={baseLinkStyle} 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Mission: Impactor-2025
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
