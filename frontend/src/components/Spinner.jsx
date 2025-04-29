import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-white rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Spinner;