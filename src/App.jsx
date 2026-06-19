import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingState from './components/LoadingState';

const HomePage = lazy(() => import('./pages/HomePage'));
const CountryProfilePage = lazy(() => import('./pages/CountryProfilePage'));
const GroupsPage = lazy(() => import('./pages/GroupsPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function withPageFallback(element) {
  return <Suspense fallback={<LoadingState />}>{element}</Suspense>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={withPageFallback(<HomePage />)} />
        <Route path="/country/:code" element={withPageFallback(<CountryProfilePage />)} />
        <Route path="/groups" element={withPageFallback(<GroupsPage />)} />
        <Route path="/schedule" element={withPageFallback(<SchedulePage />)} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={withPageFallback(<NotFoundPage />)} />
      </Route>
    </Routes>
  );
}
