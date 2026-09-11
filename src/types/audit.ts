export type AuditActionCategory = 
  | 'ADMISSION'
  | 'PAYROLL'
  | 'PERMISSION'
  | 'VACATION'
  | 'BENEFIT'
  | 'SYSTEM'
  | 'TERMINATION';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  category: AuditActionCategory;
  action: string;
  targetEntity: string;
  targetId: string;
  ipAddress: string;
  details: string;
}
