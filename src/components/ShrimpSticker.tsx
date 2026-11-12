import React from 'react';

interface ShrimpStickerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  withBadge?: boolean;
}

export const ShrimpSticker: React.FC<ShrimpStickerProps> = ({
  size = 'md',
  className = '',
  withBadge = false,
}) => {
  const sizeMap = {
    xs: { px: 20, font: 'text-sm', badgeSize: 'w-7 h-7' },
    sm: { px: 26, font: 'text-base', badgeSize: 'w-9 h-9' },
    md: { px: 36, font: 'text-2xl', badgeSize: 'w-12 h-12' },
    lg: { px: 48, font: 'text-3xl', badgeSize: 'w-16 h-16' },
    xl: { px: 64, font: 'text-4xl', badgeSize: 'w-20 h-20' },
    '2xl': { px: 84, font: 'text-5xl', badgeSize: 'w-24 h-24' },
    hero: { px: 110, font: 'text-6xl', badgeSize: 'w-32 h-32' },
  };

  const current = sizeMap[size];

  const svgContent = (
    <svg
      width={current.px}
      height={current.px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transform transition-transform hover:scale-105"
      style={{
        filter: 'drop-shadow(0 3px 5px rgba(255, 122, 26, 0.35)) drop-shadow(0 0 2px #FFFFFF)',
      }}
    >
      {/* Outer 3D Die-Cut White Sticker Border (Layer 1) */}
      <path
        d="M26 18C36 12 56 12 70 20C82 28 86 42 84 55C82 68 72 80 58 84C46 88 34 84 26 76C18 68 14 54 18 40C20 30 22 22 26 18Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Antennae Sticker White Backing */}
      <path
        d="M32 20C24 10 12 12 8 16M38 18C44 8 58 6 68 10"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Main Curved Shrimp Body - Rich Warm Orange Gradient */}
      <defs>
        <linearGradient id="shrimpOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA654" />
          <stop offset="45%" stopColor="#FF7A1A" />
          <stop offset="100%" stopColor="#E65800" />
        </linearGradient>
        <linearGradient id="shrimpHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Antennae */}
      <path
        d="M32 20C24 10 12 12 8 16M38 18C44 8 58 6 68 10"
        stroke="#FF9440"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Shrimp Head & Upper Thorax */}
      <path
        d="M28 20C38 14 58 14 68 22C78 30 82 42 80 54C78 64 70 74 58 78C48 81 36 78 28 70C20 62 18 50 20 38C22 28 24 22 28 20Z"
        fill="url(#shrimpOrangeGrad)"
      />

      {/* Segments (เปลือกกุ้งเป็นปล้องๆ ชัดเจน) */}
      <path
        d="M40 22C46 32 48 50 42 66"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M52 25C58 35 60 52 54 68"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M64 32C70 42 70 56 64 68"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* Tail Fan (หางกุ้งรูปพัด 3 แฉกสีส้มแดงสดใส) */}
      <g>
        <path
          d="M28 72C22 76 16 82 12 90C18 88 26 84 32 78Z"
          fill="#E65800"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <path
          d="M32 75C28 82 24 88 22 94C28 92 34 86 36 78Z"
          fill="#FF7A1A"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <path
          d="M35 72C34 80 34 88 36 94C40 88 42 82 40 74Z"
          fill="#FFA654"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      </g>

      {/* Cute 3D Eye (ตาแป๋วสไตล์สติกเกอร์ 3D) */}
      <circle cx="28" cy="28" r="4.5" fill="#1A2B33" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="26.5" cy="26.5" r="1.5" fill="#FFFFFF" />

      {/* Top Gloss Highlight */}
      <path
        d="M35 20C45 16 60 17 68 25C74 32 76 40 74 48C70 38 60 28 45 24Z"
        fill="url(#shrimpHighlight)"
      />
    </svg>
  );

  if (withBadge) {
    return (
      <div className={`shrimp-sticker-badge ${current.badgeSize} shrink-0 ${className}`}>
        {svgContent}
      </div>
    );
  }

  return (
    <div className={`shrimp-sticker shrink-0 inline-flex items-center justify-center ${className}`}>
      {svgContent}
    </div>
  );
};
