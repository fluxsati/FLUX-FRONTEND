import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import the correct poster from FluxWave_2.0 folder
import posterImage from '../assets/events/FluxWave_2.0/poster.jpeg';

const FluxWavePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup every time the user visits
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    
    return () => clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    // Auto-close after 2 seconds when opened
    if (isOpen) {
      const closeTimer = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
      return () => clearTimeout(closeTimer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleImageClick = () => {
    setIsOpen(false);
    navigate('/events/fluxwave-2.0');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-[90vw] max-w-[400px] bg-black rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.4)] border border-cyan-500/30 z-10"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
            
            <div 
              className="relative w-full cursor-pointer group flex items-center justify-center bg-black"
              onClick={handleImageClick}
            >
              <img 
                src={posterImage} 
                alt="Event Poster" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              
              {/* Always visible button overlay */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10">
                <span className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-full uppercase tracking-widest text-sm shadow-xl shadow-cyan-500/30 transition-all duration-300 transform group-hover:scale-105 pointer-events-auto">
                  Register Now
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FluxWavePopup;
