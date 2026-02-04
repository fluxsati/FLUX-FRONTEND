import React from 'react';

/**
 * Unified Card Component for consistent styling across the application
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - 'default' | 'glass' | 'hover'
 * @param {string} props.className - Additional Tailwind classes
 */
const FluxCard = ({ 
  children, 
  variant = 'default', 
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-flux-lg transition-all duration-300';
  
  const variants = {
    default: '',
    hover: 'hover:shadow-flux-lg hover:border-cyan-600/50 cursor-pointer',
    glass: 'backdrop-blur-xl bg-white/80 dark:bg-black/60',
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default FluxCard;

