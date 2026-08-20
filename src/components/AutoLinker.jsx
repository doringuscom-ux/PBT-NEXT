"use client";
import React from 'react';

const AutoLinker = ({ html, className = '' }) => {
  if (!html) return null;

  return (
    <div
      className={`rich-text-content [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_a]:font-bold [&_a]:transition-colors ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default AutoLinker;