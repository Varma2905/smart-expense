import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, Sparkles, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getGreeting } from '../../utils/formatters';

export const Navbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Dynamic Page Title mapping
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/transactions': 'Transactions Management',
    '/budgets': 'Budget Management',
    '/analytics': 'Financial Analytics',
    '/recurring': 'Recurring Transactions',
    '/reports': 'Financial Reports',
    '/ai-insights': 'AI Financial Insights',
    '/settings': 'Settings & Preferences',
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  const mockNotifications = [
    { id: 1, title: 'Budget Limit Warning', desc: 'Food category has reached 85% of monthly limit.', type: 'warning' },
    { id: 2, title: 'Upcoming Recurring Bill', desc: 'Netflix Subscription due in 2 days.', type: 'info' },
  ];

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between transition-colors duration-300">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{currentTitle}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            {getGreeting()}, <span className="text-brand-600 dark:text-brand-400 font-semibold">{user?.name}</span>
          </p>
        </div>
      </div>

      {/* Right Actions: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-navy-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-navy-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-card border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400">
                  {mockNotifications.length} new
                </span>
              </div>
              <div className="space-y-3 pt-3">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-navy-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`
              }
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 bg-slate-800"
            />
            <span className="text-xs font-semibold text-slate-200 hidden md:block">{user?.name?.split(' ')[0]}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 glass-card border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-scale-up space-y-1">
              <div className="p-3 border-b border-slate-800">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>

              <a
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-brand-400" />
                Settings
              </a>

              <a
                href="/ai-insights"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI Assistant
              </a>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
