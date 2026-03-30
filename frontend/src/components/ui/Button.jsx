import LoadingSpinner from './LoadingSpinner.jsx';

const variants = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'text-gray-600 hover:bg-gray-100',
};

export default function Button({
  children, variant = 'primary', isLoading = false,
  className = '', ...props
}) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                  font-medium disabled:cursor-not-allowed
                  ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}