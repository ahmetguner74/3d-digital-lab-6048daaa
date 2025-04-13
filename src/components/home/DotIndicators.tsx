
import React from "react";

interface DotIndicatorsProps {
  totalCount: number;
  activeIndex: number;
  onClick: (index: number) => void;
}

export default function DotIndicators({ 
  totalCount, 
  activeIndex, 
  onClick 
}: DotIndicatorsProps) {
  if (totalCount <= 1) return null;
  
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: totalCount }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onClick(idx)}
          className={`w-3 h-3 rounded-full ${idx === activeIndex ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
          aria-label={`Proje ${idx + 1}`}
          aria-current={idx === activeIndex ? "true" : "false"}
        />
      ))}
    </div>
  );
}
