// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider }                    from '@tanstack/react-query';
import { useEffect, useRef }                      from 'react';
import { queryClient }                            from './lib/queryClient.js';
import useAuthStore                               from './store/auth.store.js';

// Pages
import LoginPage      from './pages/LoginPage.jsx';
import DashboardPage  from './pages/DashboardPage.jsx';
import StudentsPage   from './pages/StudentsPage.jsx';
import StudentDetail  from './pages/StudentDetail.jsx';
import ClassesPage    from './pages/ClassesPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import GradesPage     from './pages/GradesPage.jsx';
import NotFoundPage   from './pages/NotFoundPage.jsx';

// Layout
import AppLayout      from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import LoadingScreen  from './components/ui/LoadingScreen.jsx';

export default function App() {
  const { initialize, isLoading } = useAuthStore();

  // useRef guard prevents double-call in React StrictMode
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initialize();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/"             element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/students"     element={<StudentsPage />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/classes"      element={<ClassesPage />} />
              <Route path="/attendance"   element={<AttendancePage />} />
              <Route path="/grades"       element={<GradesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}