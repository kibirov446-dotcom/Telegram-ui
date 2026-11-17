import React from 'react';

export const AnimatedLiquidBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#070B14]"
      aria-hidden="true"
    >
      {/* Top-left blue mesh blob */}
      <div
        className="animate-blob-1 absolute top-0 left-0 h-[340px] w-[340px] rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, rgba(29, 78, 216, 0.45) 0%, rgba(29, 78, 216, 0) 70%)',
        }}
      />

      {/* Bottom-right violet mesh blob */}
      <div
        className="animate-blob-2 absolute right-0 bottom-0 h-[380px] w-[380px] rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, rgba(124, 58, 237, 0.38) 0%, rgba(124, 58, 237, 0) 70%)',
        }}
      />

      {/* Center sky-blue mesh blob */}
      <div
        className="animate-blob-3 absolute top-1/2 left-1/2 -mt-[130px] -ml-[130px] h-[260px] w-[260px] rounded-full blur-[85px]"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0) 70%)',
        }}
      />
    </div>
  );
};
