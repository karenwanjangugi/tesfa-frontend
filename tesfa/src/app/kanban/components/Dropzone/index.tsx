import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropZoneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function DropZone({ id, children, className = '' }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  
  const baseClasses = 'rounded-md transition-all duration-200 ease-in-out';
  const overClasses = 'bg-blue-100';
  
  return (
    <div
      ref={setNodeRef}
      className={`${baseClasses} ${isOver ? overClasses : 'bg-transparent' } ${className}`}
    >
      {children}
    </div>
  );
  
}
