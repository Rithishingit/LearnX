import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  padding = 'md',
  shadow = 'soft',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    'soft-lg': 'shadow-soft-lg'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300' 
    : '';

  const classes = `bg-white rounded-2xl ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;