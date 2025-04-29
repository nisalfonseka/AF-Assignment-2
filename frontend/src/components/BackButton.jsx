import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { motion } from 'framer-motion';

const BackButton = ({ destination = '/' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };
  
  return (
    <div className='flex'>
      <Link
        to={destination}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        ref={buttonRef}
        aria-label="Go back"
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white overflow-hidden group shadow-inner shadow-white/5"
          whileHover={{ 
            width: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ width: '2.5rem' }}
          style={{
            background: isHovered ? 
              `radial-gradient(circle at ${position.x * 100}% ${position.y * 100}%, rgba(255, 255, 255, 0.15), transparent 70%)` : 
              'rgba(0, 0, 0, 0.5)',
          }}
        >
          <motion.div
            className="flex items-center justify-center"
            animate={isHovered ? { x: -3, opacity: 1 } : { x: 0, opacity: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <BsArrowLeft className="text-xl" />
          </motion.div>
          
          <motion.span
            className="whitespace-nowrap font-medium tracking-wide"
            initial={{ opacity: 0, width: 0 }}
            animate={isHovered ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
          >
            Back
          </motion.span>
        </motion.div>
        
        {/* Elegant border animation */}
        <motion.div
          className="absolute -inset-px rounded-full z-[-1] border border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={isHovered ? { 
            opacity: 0.8, 
            scale: 1.02,
          } : { 
            opacity: 0, 
            scale: 1,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Subtle light effect */}
        <motion.div
          className="absolute inset-0 rounded-full z-[-2] bg-white/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isHovered ? { 
            opacity: [0.1, 0.2, 0.1], 
            scale: 1.5,
            transition: {
              opacity: {
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              },
              scale: { duration: 0.8 }
            }
          } : { 
            opacity: 0, 
            scale: 0.95,
            transition: { duration: 0.3 }
          }}
        />
      </Link>
    </div>
  );
};

export default BackButton;