import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Search } from 'lucide-react';
import { api } from '../../services/api';
import type { AuditLog } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminAuditLogs: React.FC = () => {
  const [actionSearch, setActionSearch] = useState<string>('');

  const { data: auditLogs, isLoading } = useQuery<AuditLog[]>({
    queryKey: ['adminAuditLogs', actionSearch],
    queryFn: async () => {
      const params: any = {};
      if (actionSearch) params.action = actionSearch;
      const res = await api.get('/audit-logs/', { params });
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Enterprise Audit Trail
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Immutable system trail logging administrative mutations, leave approvals, and payroll modifications.
        </p>
      </div>

      <Card className="p-4 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={actionSearch}
            onChange={(e) => setActionSearch(e.target.value)}
            placeholder="Filter by action type (e.g. LEAVE_APPROVED)..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Total Entries: {auditLogs?.length || 0}</span>
      </Card>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-6">Timestamp (UTC)</th>
                  <th className="py-3.5 px-6">Actor ID</th>
                  <th className="py-3.5 px-6">Action</th>
                  <th className="py-3.5 px-6">Entity</th>
                  <th className="py-3.5 px-6">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm font-mono">
                {auditLogs?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-300 text-xs font-semibold">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                      {log.actor_user_id ? `User#${log.actor_user_id}` : 'System'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="warning">{log.action}</Badge>
                    </td>
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-300 text-xs font-semibold">
                      {log.entity_type} #{log.entity_id || '-'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 text-xs font-mono max-w-md truncate font-medium">
                      {log.metadata_json ? JSON.stringify(log.metadata_json) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
