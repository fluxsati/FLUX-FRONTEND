import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Unified Button Component with consistent styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - 'primary' | 'secondary' | 'ghost'
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional classes
 */
const FluxButton = ({ 
  children, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };

  return (
    <button
      type={type}
      className={`${variants[variant]} ${className} flex items-center justify-center gap-2`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
};

export default FluxButton;

