export type UserRole = 'EMPLOYEE' | 'HR' | 'ADMIN';

export interface User {
  id: number;
  employee_id: string;
  email: string;
  role: UserRole;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  employee_profile?: Employee;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  job_title: string;
  department_id?: number;
  joining_date: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  department?: Department;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSummary {
  total_days: number;
  present_days: number;
  absent_days: number;
  half_days: number;
  leave_days: number;
  attendance_rate: number;
}

export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  remarks?: string;
  status: LeaveStatus;
  admin_comment?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface Payroll {
  id: number;
  employee_id: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  effective_from: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export type NotificationType =
  | 'LEAVE_SUBMITTED'
  | 'LEAVE_APPROVED'
  | 'LEAVE_REJECTED'
  | 'PAYROLL_UPDATED'
  | 'ATTENDANCE_ALERT'
  | 'GENERAL';

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor_user_id?: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  metadata_json?: Record<string, any>;
  timestamp: string;
}

export interface AnalyticsReport {
  summary: {
    total_employees: number;
    present_today: number;
    absent_today: number;
    on_leave_today: number;
    pending_leave_requests: number;
  };
  attendance_trends: Array<{
    date: string;
    present: number;
    absent: number;
    leave: number;
  }>;
  leave_distribution: Array<{
    type: string;
    count: number;
  }>;
  department_stats: Array<{
    department: string;
    employees: number;
  }>;
  payroll_overview: {
    total_basic: number;
    total_allowances: number;
    total_deductions: number;
    total_net: number;
  };
}
