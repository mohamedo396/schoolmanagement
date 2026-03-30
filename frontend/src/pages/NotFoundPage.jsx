import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}