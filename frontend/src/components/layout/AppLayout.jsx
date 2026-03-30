// src/components/layout/AppLayout.jsx
import { Outlet }   from 'react-router-dom';
import Sidebar      from './Sidebar.jsx';
import Header       from './Header.jsx';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar — fixed left column */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Outlet renders whatever child route is active */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}