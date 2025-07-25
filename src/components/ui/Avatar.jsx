export function Avatar({ src, alt = "User avatar", className = "", square = false, size = "md" }) {
  const shapeClasses = square ? "rounded-lg" : "rounded-full";
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8 sm:w-10 sm:h-10",
    lg: "w-10 h-10 sm:w-12 sm:h-12"
  };

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4 sm:w-5 sm:h-5",
    lg: "w-6 h-6 sm:w-7 sm:h-7"
  };
  
  return (
    <div className={`${sizeClasses[size]} ${shapeClasses} overflow-hidden bg-gray-300 flex items-center justify-center transition-all duration-200 hover:ring-2 hover:ring-blue-400 cursor-pointer ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <svg className={`${iconSizeClasses[size]} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}
