import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  radius?: string;
  glassAlpha?: number;
  borderAlpha?: number;
  onClick?: () => void;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = '',
  radius = '24px',
  glassAlpha = 0.14,
  borderAlpha = 0.28,
  onClick,
}) => {
  const topAlpha = glassAlpha + 0.06;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden backdrop-blur-2xl backdrop-saturate-150 ${className}`}
      style={{
        borderRadius: radius,
        background: `linear-gradient(180deg, rgba(255, 255, 255, ${topAlpha}) 0%, rgba(255, 255, 255, ${glassAlpha}) 100%)`,
        boxShadow:
          '0 10px 32px -10px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)',
      }}
    >
      {/* Gradient specular border overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          padding: '1px',
          background: `linear-gradient(135deg, rgba(255, 255, 255, ${borderAlpha}) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(51, 144, 236, 0.25) 100%)`,
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
