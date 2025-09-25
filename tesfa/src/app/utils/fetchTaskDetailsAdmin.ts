import { getToken } from "./getTokenAdmin";
import { TaskDetail } from "./type";

export const fetchTasksDetailsAdmin = async (): Promise<TaskDetail[]> => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found in local storage.");
  }
  const response = await fetch("/api/task-details-admin", {

    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch all tasks" }));
    throw new Error(errorData.message);
  }

  const data = await response.json();
  return data;
};
