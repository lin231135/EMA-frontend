export function Avatar({ src, alt = "User avatar", className = "", square = false }) {
  const shapeClasses = square ? "rounded-lg" : "rounded-full";
  
  return (
    <div className={`w-8 h-8 ${shapeClasses} overflow-hidden bg-gray-300 flex items-center justify-center ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}
