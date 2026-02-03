import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  className = '', 
  showLabel = true, 
  size = 'md',
  color = 'primary',
  animated = true 
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'from-primary-500 to-secondary-500',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-pink-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;