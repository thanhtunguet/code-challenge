import { useState } from 'react';

interface TokenIconProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

export function TokenIcon({ src, alt, size = 'md' }: TokenIconProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-semibold text-primary`}
      >
        {alt.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-contain`}
      onError={() => setError(true)}
    />
  );
}
