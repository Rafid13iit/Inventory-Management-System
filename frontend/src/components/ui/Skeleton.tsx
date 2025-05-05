import React from 'react';

interface SkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  height = 'h-4',
  width = 'w-full',
  borderRadius = 'rounded',
  className = '',
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${height} ${width} ${borderRadius} ${className}`}
    ></div>
  );
};

export default Skeleton;