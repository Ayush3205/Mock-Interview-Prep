"use client";

import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const SimpleDropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  children, 
  align = 'right',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`
          absolute top-full mt-2 z-50 min-w-[280px] 
          bg-gray-900 border border-gray-700 rounded-lg shadow-xl
          animate-in fade-in-0 zoom-in-95 duration-100
          ${align === 'right' ? 'right-0' : 'left-0'}
          ${className}
        `}>
          {children}
        </div>
      )}
    </div>
  );
};

export const SimpleDropdownItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => (
  <div 
    className={`px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 cursor-pointer transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const SimpleDropdownSeparator: React.FC = () => (
  <div className="h-px bg-gray-700 my-1" />
);
