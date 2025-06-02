import React from 'react';
import { Link } from 'react-router-dom';

const HackMapLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="rounded-lg"
        >
          {/* Background gradient */}
          <rect width="100" height="100" rx="12" fill="url(#paint0_linear)" />
          
          {/* Map outline - Simplified world map silhouette */}
          <path 
            d="M20 35C25 30 35 28 40 30C45 32 55 28 60 32C65 36 75 34 80 40" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeOpacity="0.7"
          />
          <path 
            d="M25 45C30 40 40 42 45 45C50 48 55 45 60 48C65 51 70 50 75 55" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeOpacity="0.7"
          />
          <path 
            d="M30 60C35 55 45 58 50 62C55 66 65 60 70 65" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeOpacity="0.7"
          />
          
          {/* HM Letters - Combined design */}
          <path 
            d="M30 25V75M30 25H45M30 50H45M45 25V75M55 25V75M55 25L70 75M55 50L70 50" 
            stroke="white" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          <defs>
            <linearGradient 
              id="paint0_linear" 
              x1="0" 
              y1="0" 
              x2="100" 
              y2="100" 
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8B5CF6"/> {/* Purple-500 */}
              <stop offset="1" stopColor="#3B82F6"/> {/* Blue-500 */}
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        HackMap
      </span>
    </Link>
  );
};

export default HackMapLogo;
