import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Employee Pages
import { EmployeeDashboard } from './pages/employee/Dashboard';
import { Profile } from './pages/employee/Profile';
import { EmployeeAttendance } from './pages/employee/Attendance';
import { EmployeeLeaves } from './pages/employee/Leaves';
import { EmployeePayroll } from './pages/employee/Payroll';
import { EmployeeNotifications } from './pages/employee/Notifications';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminEmployeeDetail } from './pages/admin/AdminEmployeeDetail';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminLeaves } from './pages/admin/AdminLeaves';
import { AdminPayroll } from './pages/admin/AdminPayroll';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Employee Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<EmployeeDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/attendance" element={<EmployeeAttendance />} />
              <Route path="/leaves" element={<EmployeeLeaves />} />
              <Route path="/payroll" element={<EmployeePayroll />} />
              <Route path="/notifications" element={<EmployeeNotifications />} />
            </Route>

            {/* Admin & HR Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['HR', 'ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<AdminEmployees />} />
              <Route path="/admin/employees/:id" element={<AdminEmployeeDetail />} />
              <Route path="/admin/attendance" element={<AdminAttendance />} />
              <Route path="/admin/leaves" element={<AdminLeaves />} />
              <Route path="/admin/payroll" element={<AdminPayroll />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            </Route>

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
