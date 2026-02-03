import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb Navigation Component
 * @param {Object} props
 * @param {Array} props.items - Array of {label, path}
 */
const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        aria-label="Home"
      >
        <Home size={16} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-slate-500 dark:text-slate-400" />
          {index === items.length - 1 ? (
            <span className="text-slate-900 dark:text-white font-semibold" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link 
              to={item.path} 
              className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

