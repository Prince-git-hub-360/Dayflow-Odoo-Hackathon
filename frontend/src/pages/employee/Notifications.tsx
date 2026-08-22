import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import type { NotificationItem } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const EmployeeNotifications: React.FC = () => {
  const { data: notifications, isLoading, refetch } = useQuery<NotificationItem[]>({
    queryKey: ['myNotificationsFull'],
    queryFn: async () => {
      const res = await api.get('/notifications/');
      return res.data;
    },
  });

  const markRead = async (id: number) => {
    await api.patch(`/notifications/${id}/read`);
    refetch();
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" /> Notifications & Alerts
          </h1>
          <p className="text-sm text-slate-400">
            System updates, leave review notifications, and administrative messages.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={markAllRead}>
          Mark All as Read
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : notifications && notifications.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-6 flex items-start justify-between gap-4 transition-colors ${
                  n.is_read ? 'bg-slate-950/40' : 'bg-indigo-950/20'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{n.title}</span>
                    <Badge variant={n.is_read ? 'neutral' : 'info'}>
                      {n.notification_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors shrink-0"
                    title="Mark as Read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-sm">No notifications found.</div>
        )}
      </Card>
    </div>
  );
};
