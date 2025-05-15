import React from 'react';
import Image from 'next/image';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      <div className="mb-8">
        <Image
          src="/next.svg"
          alt="Logo"
          width={120}
          height={120}
          className="animate-pulse"
        />
      </div>
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner; 