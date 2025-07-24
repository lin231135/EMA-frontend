import { useState, useRef, useEffect } from 'react';

export function Dropdown({ children }) {
  return <div className="relative">{children}</div>;
}

export function DropdownButton({ children, className = "", ...props }) {
  return (
    <button
      className={`flex items-center text-gray-200 hover:text-white focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenu({ children, isOpen, className = "", anchor = "bottom end" }) {
  if (!isOpen) return null;

  const anchorClasses = {
    'bottom end': 'absolute right-0 top-full mt-2',
    'bottom start': 'absolute left-0 top-full mt-2',
  };

  return (
    <div
      className={`${anchorClasses[anchor]} z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownItem({ href, children, onClick, className = "" }) {
  const baseClasses = "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer";
  
  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} w-full text-left ${className}`}>
      {children}
    </button>
  );
}

export function DropdownLabel({ children }) {
  return <span className="ml-3">{children}</span>;
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-gray-200"></div>;
}
