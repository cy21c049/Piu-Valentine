import React, { useState, useCallback, useRef } from 'react';

interface RunawayButtonProps {
  label: string;
  onRun?: () => void;
}

const RunawayButton: React.FC<RunawayButtonProps> = ({ label, onRun }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const moveButton = useCallback(() => {
    // Generate random coordinates within a reasonable range of the current position
    // or just anywhere in the viewport that's safe.
    const padding = 100;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    
    const randomX = Math.random() * (maxX - padding) + padding / 2;
    const randomY = Math.random() * (maxY - padding) + padding / 2;

    // Use absolute positioning relative to the body/container
    // For this simple app, we'll use transform for smoothness
    setPosition({ 
      x: randomX - (window.innerWidth / 2), 
      y: randomY - (window.innerHeight / 2) 
    });

    if (onRun) {
      onRun();
    }
  }, [onRun]);

  return (
    <button
      ref={buttonRef}
      onMouseEnter={moveButton}
      onTouchStart={moveButton}
      className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-full shadow-lg transition-transform duration-200 ease-out active:scale-95 z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: 'relative'
      }}
    >
      {label}
    </button>
  );
};

export default RunawayButton;