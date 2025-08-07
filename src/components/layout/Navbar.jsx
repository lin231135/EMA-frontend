export function Navbar({ children, className = "" }) {
  return (
    <nav className={`bg-gray-800 w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {children.slice(0, -1)}
          </div>
          <div className="flex items-center">
            {children.slice(-1)}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NavbarSection({ children, className = "" }) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {children}
    </div>
  );
}

export function NavbarItem({ href, children, className = "" }) {
  return (
    <a 
      href={href} 
      className={`text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${className}`}
    >
      {children}
    </a>
  );
}

export function NavbarDivider({ className = "" }) {
  return (
    <div className={`w-px h-6 bg-gray-600 mx-4 ${className}`}></div>
  );
}
