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

  const style = {
    // border: '2px dashed',
    // borderColor: isOver ? '#3b82f6' : 'rgba(0,0,0,0.2)',
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children}
    </div>
  );
}
