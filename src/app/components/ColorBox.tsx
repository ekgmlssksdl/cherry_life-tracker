import React from 'react';

interface ColorBoxProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rounded?: boolean;
}

export const ColorBox: React.FC<ColorBoxProps> = ({ 
  color, 
  size = 'md', 
  className = '',
  rounded = true 
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ backgroundColor: color }}
    />
  );
};
