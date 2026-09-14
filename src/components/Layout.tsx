import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { BookOpen, LayoutGrid, Shield, LogOut, User, Bell } from 'lucide-react';

export default function Layout() {
  const { currentUser, logout, accessRequests } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const pendingCount = accessRequests.filter(r => r.status === 'PENDING').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/catalog', label: 'Каталог курсов', icon: LayoutGrid },
    ...(currentUser?.role === 'superadmin' || currentUser?.role === 'methodist' 
      ? [{ path: '/admin', label: 'Управление', icon: Shield }] 
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/catalog" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900">EduVault</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.path === '/admin' && pendingCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {(currentUser?.role === 'superadmin' || currentUser?.role === 'methodist') && pendingCount > 0 && (
                <Link to="/admin" className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>
              )}
              
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 leading-tight">{currentUser?.fullName}</p>
                  <p className="text-xs text-slate-500">
                    {currentUser?.role === 'superadmin' ? 'Администратор' : 
                     currentUser?.role === 'methodist' ? 'Методист' : 'Учитель'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-1 overflow-x-auto">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
