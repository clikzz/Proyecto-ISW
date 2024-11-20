import React from 'react';

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
}
