import Layout from "../sharedComponents/Layout";
import ProtectedRoute from "../sharedComponents/ProtectedRoot";
import TasksDetails from "./components/TaskDetails";

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <TasksDetails />
      </Layout>
    </ProtectedRoute>
  );
}




