import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel3D = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getStyles = (index) => {
    // Determine relative position
    let relativeIndex = index - currentIndex;
    
    // Normalize relative index for seamless looping
    if (relativeIndex < -1) relativeIndex += images.length;
    if (relativeIndex > 1) relativeIndex -= images.length;

    // Handle edge cases for small arrays (e.g., 2 items)
    if (images.length === 2) {
      if (relativeIndex === 1) relativeIndex = 1; // Always show the other one on the right
    }

    if (relativeIndex === 0) {
      return { x: "0%", scale: 1, zIndex: 10, opacity: 1, filter: "brightness(1)" };
    } else if (relativeIndex === 1) {
      return { x: "40%", scale: 0.8, zIndex: 5, opacity: 0.6, filter: "brightness(0.5)" };
    } else if (relativeIndex === -1) {
      return { x: "-40%", scale: 0.8, zIndex: 5, opacity: 0.6, filter: "brightness(0.5)" };
    } else {
      return { x: "0%", scale: 0.5, zIndex: 0, opacity: 0, filter: "brightness(0.2)" };
    }
  };

  return (
    <div className="relative w-full h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden perspective-[1000px] py-8">
      <button 
        onClick={handlePrev}
        className="absolute left-2 md:left-8 z-20 p-2 md:p-3 bg-white/5 hover:bg-cyan-500 backdrop-blur-md rounded-full text-white border border-white/10 transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="relative w-3/4 max-w-lg h-full flex justify-center items-center">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={getStyles(index)}
            transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
            className="absolute w-full h-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer border border-white/10 bg-[#1a1a1a]"
            onClick={() => setCurrentIndex(index)}
          >
            <img 
              src={img} 
              alt={`Slide ${index}`} 
              className="w-full h-full object-cover pointer-events-none" 
            />
            
            {/* Center Image Overlay */}
            {index === currentIndex && (
              <div className="absolute inset-0 border-2 border-cyan-500 rounded-2xl pointer-events-none z-10 opacity-50"></div>
            )}
          </motion.div>
        ))}
      </div>

      <button 
        onClick={handleNext}
        className="absolute right-2 md:right-8 z-20 p-2 md:p-3 bg-white/5 hover:bg-cyan-500 backdrop-blur-md rounded-full text-white border border-white/10 transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Carousel3D;
