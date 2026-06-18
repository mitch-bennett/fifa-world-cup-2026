import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CountryProfilePage from './pages/CountryProfilePage';
import GroupsPage from './pages/GroupsPage';
import SchedulePage from './pages/SchedulePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/country/:code" element={<CountryProfilePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
