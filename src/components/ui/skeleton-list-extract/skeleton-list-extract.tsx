import React from "react";

interface SkeletonProps {
  rows?: number;
}

export default function SkeletonListExtract({ rows = 5 }: SkeletonProps) {
  return (
    <ul className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <li key={index}>
          <div className="animate-pulse flex flex-col gap-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}