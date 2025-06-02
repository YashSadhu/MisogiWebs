import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2 cursor-pointer">
      <img 
        src="/Chatgpt.png" 
        alt="HackMap Logo"
        className="w-10 h-10 object-contain"
      />
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        HackMap
      </span>
    </div>
  );
};

export default Logo;
