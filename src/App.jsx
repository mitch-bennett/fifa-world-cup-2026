import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const CountryProfilePage = lazy(() => import('./pages/CountryProfilePage'));
const GroupsPage = lazy(() => import('./pages/GroupsPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<p className="empty">Loading page...</p>}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/country/:code"
          element={
            <Suspense fallback={<p className="empty">Loading page...</p>}>
              <CountryProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/groups"
          element={
            <Suspense fallback={<p className="empty">Loading page...</p>}>
              <GroupsPage />
            </Suspense>
          }
        />
        <Route
          path="/schedule"
          element={
            <Suspense fallback={<p className="empty">Loading page...</p>}>
              <SchedulePage />
            </Suspense>
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<p className="empty">Loading page...</p>}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
