import { ApiTask, Task } from "./type";
import { getTokenFromLocalStorage } from "./getToken";

export const getKanbanStatus = (apiStatus: string): Task["status"] => {
  switch (apiStatus) {
    case "completed":
      return "completed";
    case "pending":
      return "pending";
    case "in_progress":
      return "in_progress";
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
};

export async function mapApiTask(apiTask: ApiTask): Promise<Task> {
  const status =
    apiTask.assignments && apiTask.assignments.length > 0
      ? getKanbanStatus(apiTask.assignments[0].status)
      : "pending";

  return {
    id: apiTask.id.toString(),
    title: apiTask.title,
    description: apiTask.description,
    status: status,
  };
}

export const fetchTasks = async (): Promise<ApiTask[]> => {
  const token = getTokenFromLocalStorage();

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch("api/tasks" ,{ headers });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks from API");
  }
  return response.json();
};
