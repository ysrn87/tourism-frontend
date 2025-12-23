// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin';
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Request types
export interface Request {
  id: number;
  user_id: number;
  destination: string;
  message?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  agent_id?: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  agent_name?: string;
  agent_email?: string;
  agent_phone?: string;
}

// Activity log types
export interface ActivityLog {
  id: number;
  actor_id: number;
  actor_role: string;
  actor_name?: string;
  action: string;
  request_id?: number;
  from_status?: string;
  to_status?: string;
  note?: string;
  created_at: string;
}

// API response types
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | PaginationMeta;
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Auth types
export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// Statistics types
export interface UserStats {
  total: number;
  pending: number;
  assigned: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

export interface AgentStats {
  total: number;
  assigned: number;
  in_progress: number;
  completed: number;
}

export interface AdminStats {
  total_requests: number;
  pending_requests: number;
  assigned_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  cancelled_requests: number;
  total_users: number;
  total_agents: number;
  active_agents: number;
}

// Agent with workload
export interface AgentWithWorkload extends User {
  total_requests: number;
  active_requests: number;
  completed_requests: number;
}