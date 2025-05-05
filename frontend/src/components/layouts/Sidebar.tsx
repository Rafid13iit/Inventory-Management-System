import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { state } = useAuth();
  const { user } = state;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      roles: ['ADMIN', 'USER'],
    },
    {
      name: 'Products',
      path: '/products',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      roles: ['ADMIN', 'USER'],
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      roles: ['ADMIN', 'USER'],
    },
    {
      name: 'Sales',
      path: '/sales',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      roles: ['ADMIN'],
    },
  ];

  return (
    <div className="h-full bg-gray-800 w-64 fixed inset-y-0 left-0 md:relative md:translate-x-0 transform -translate-x-full md:flex flex-col z-30 transition-transform duration-300 shadow-xl">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <Link to="/" className="text-white font-bold text-xl">
          Inventory Manager
        </Link>
      </div>
      <div className="overflow-y-auto flex-grow">
        <nav className="mt-5 px-2">
          {navItems.map((item) => {
            // Skip rendering menu items that the user doesn't have access to
            if (!user || !item.roles.includes(user.role)) return null;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1`}
              >
                <div className="mr-4 flex-shrink-0 h-6 w-6">{item.icon}</div>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      {user && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.username}</p>
              <p className="text-xs font-medium text-gray-400">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
