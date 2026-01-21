const Loading = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`₹{sizeClasses[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`} />
      {text && (
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
