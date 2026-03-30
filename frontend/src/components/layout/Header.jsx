// src/components/layout/Header.jsx
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard':  'Dashboard',
  '/students':   'Students',
  '/classes':    'Classes',
  '/attendance': 'Attendance',
  '/grades':     'Grades',
};

export default function Header() {
  const location = useLocation();

  // Match the current path to a title
  // Also handles /students/:id by checking startsWith
  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'School Manager';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year:    'numeric',
            month:   'long',
            day:     'numeric',
          })}
        </div>
      </div>
    </header>
  );
}