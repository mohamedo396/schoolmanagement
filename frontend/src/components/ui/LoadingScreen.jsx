export default function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">🎓</div>
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent
                        rounded-full animate-spin mx-auto"/>
        <p className="mt-3 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}