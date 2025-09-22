import { TaskStatus } from "./type";
import { TaskAssignment } from "./type";
import { getTokenFromLocalStorage } from "./getToken";

export const fetchTaskAssignments = async (): Promise<TaskAssignment[]> => {
  const token = getTokenFromLocalStorage();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch("/api/task-assignments/", { headers });
  if (!response.ok) {
    throw new Error("failed to fetch task assignments from API");
  }
  return response.json();
};

export const updateTaskAssignmentStatus = async (
  id: number,
  status: TaskStatus
): Promise<TaskAssignment> => {
  const token = getTokenFromLocalStorage();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`/api/task-assignments/${id}/`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task assignment status");
  }

  return response.json();
};

export async function createTaskAssignment(task: string, organization: number) {
  const token = getTokenFromLocalStorage();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch("/api/task-assignments", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ task, organization }),
  });
  if (!response.ok) {
    throw new Error("Failed to create task assignment");
  }
  return response.json();
}

export const deleteTaskAssignment = async (
  assignmentId: number
): Promise<void> => {
  const token = getTokenFromLocalStorage();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(
    `/api/task-assignments?assignmentId=${assignmentId}`,
    {
      method: "DELETE",
      headers: headers,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete task assignment");
  }
};
