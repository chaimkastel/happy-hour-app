'use client';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function BrandLogo({ size = 'md', showText = true, className = '' }: BrandLogoProps) {
  const sizeClasses = {
    sm: { emoji: '16px', text: '14px', container: 'w-6 h-6' },
    md: { emoji: '20px', text: '16px', container: 'w-8 h-8' },
    lg: { emoji: '24px', text: '18px', container: 'w-10 h-10' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`${currentSize.container} bg-amber-100 rounded-lg flex items-center justify-center shadow-sm`}
        style={{ 
          width: currentSize.container.includes('w-6') ? '24px' : currentSize.container.includes('w-8') ? '32px' : '40px',
          height: currentSize.container.includes('h-6') ? '24px' : currentSize.container.includes('h-8') ? '32px' : '40px'
        }}
      >
        <span style={{ fontSize: currentSize.emoji }}>🍺</span>
      </div>
      {showText && (
        <div>
          <h1 
            className="font-bold text-gray-900 leading-tight"
            style={{ fontSize: currentSize.text }}
          >
            Happy Hour
          </h1>
        </div>
      )}
    </div>
  );
}
