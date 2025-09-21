export type TaskStatus = "pending" | "in_progress" | "cancelled" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignmentId?: number;
  
}

export interface ApiTask {
  id: number;
  title: string;
  description: string;
  assignments: { status: string }[];
}


export interface TaskAssignment{
    id: number;
    task: number;
    organization: number;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
}

