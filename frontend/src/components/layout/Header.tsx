import React, { useState, useEffect } from 'react';
import { Bell, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { NotificationItem } from '../../types';
import { Badge } from '../ui/Badge';
import { ThemeSelector } from '../ui/ThemeSelector';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [time, setTime] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchNotifications = async () => {
    try {
      const resCount = await api.get('/notifications/unread-count');
      setUnreadCount(resCount.data.unread_count);

      const resList = await api.get('/notifications/');
      setNotifications(resList.data.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="h-16 glass-card border-b border-slate-200 dark:border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1.5 rounded-lg shadow-inner">
          <Clock className="w-3.5 h-3.5 animate-pulse text-indigo-600 dark:text-indigo-400" />
          <span>{time || '00:00:00'}</span>
        </div>
        <Badge
          variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'HR' ? 'warning' : 'info'}
        >
          <Shield className="w-3 h-3 mr-1 inline" />
          {user?.role} MODE
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Selector Dropdown */}
        <ThemeSelector />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 rounded-xl transition-all border border-slate-200 dark:border-slate-800"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md shadow-rose-500/50">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-scale-up bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs transition-all border ${
                        n.is_read
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/40 text-slate-500 dark:text-slate-400'
                          : 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-500/30 text-slate-900 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-200">{n.title}</p>
                      <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
