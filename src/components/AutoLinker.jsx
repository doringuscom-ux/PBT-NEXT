"use client";
import React from 'react';

const AutoLinker = ({ html, className = '' }) => {
  if (!html) return null;

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default AutoLinker;