// src/pages/LoginPage.jsx
import { useState }          from 'react';
import { useNavigate }       from 'react-router-dom';
import useAuthStore          from '../store/auth.store.js';
import Button                from '../components/ui/Button.jsx';
import Input                 from '../components/ui/Input.jsx';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission

    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Axios wraps the error — the actual message is in err.response.data
      setError(
        err.response?.data?.error || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
                    flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-gray-900">School Manager</h1>
          <p className="text-gray-500 mt-1">Primary School Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@school.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg
                              p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              className="w-full justify-center py-2.5"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-medium mb-1">
              Demo credentials:
            </p>
            <p className="text-xs text-gray-600">
              Admin: admin@school.com / admin123
            </p>
            <p className="text-xs text-gray-600">
              Teacher: teacher@school.com / teacher123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}