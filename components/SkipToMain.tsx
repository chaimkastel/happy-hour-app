'use client';

import React from 'react';
import { handleKeyDown } from '@/lib/accessibility';

export default function SkipToMain() {
  const handleClick = () => {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  };
  
  return (
    <a
      href="#main-content"
      onClick={handleClick}
      onKeyDown={(e) => handleKeyDown(e, handleClick)}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}