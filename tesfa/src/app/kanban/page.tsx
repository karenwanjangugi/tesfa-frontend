import Layout from '../sharedComponents/Layout';
import KanbanBoard from './components/Board';
import { Suspense } from 'react';
import ProtectedRoute from '../sharedComponents/ProtectedRoot';
export default function KanbanPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <KanbanBoard />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}