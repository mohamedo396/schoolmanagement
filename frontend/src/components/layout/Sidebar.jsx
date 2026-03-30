// src/components/layout/Sidebar.jsx
import { NavLink }  from 'react-router-dom';
import useAuthStore from '../../store/auth.store.js';

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',  icon: '📊' },
  { to: '/students',   label: 'Students',   icon: '👨‍🎓' },
  { to: '/classes',    label: 'Classes',    icon: '🏫' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
  { to: '/grades',     label: 'Grades',     icon: '📝' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">School Manager</h1>
            <p className="text-xs text-gray-500">Primary School</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}