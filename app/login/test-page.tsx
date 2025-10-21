'use client';

import React from 'react';

export default function TestLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Test Login Page</h1>
        <p className="text-center text-gray-600">This is a simple test page to check if the issue is with NextAuth or something else.</p>
      </div>
    </div>
  );
}
