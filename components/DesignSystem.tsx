'use client';

import React from 'react';

// Button Component
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 focus:ring-yellow-400',
    secondary: 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 focus:ring-white/50',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10 focus:ring-white/50',
    ghost: 'text-white hover:bg-white/10 focus:ring-white/50'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Card Component
export function Card({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any;
}) {
  const baseClasses = 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg';
  const hoverClasses = hover ? 'hover:bg-white/20 transition-all duration-300 transform hover:scale-105' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Badge Component
export function Badge({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  [key: string]: any;
}) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
  
  const variants = {
    default: 'bg-white/10 text-white border border-white/20',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
  };
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}

// Avatar Component
export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  className = '', 
  ...props 
}: {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  [key: string]: any;
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center ${className}`} {...props}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className="text-white font-bold text-sm">?</span>
      )}
    </div>
  );
}