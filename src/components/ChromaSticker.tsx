import React, { useEffect, useState } from 'react';

const FALLBACK_STICKER_SRC = '/src/assets/images/shrimp_logo_sticker_1794416778119.jpg';

interface ChromaStickerProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | number;
  className?: string;
  keyOutMagenta?: boolean;
}

const transparentCache = new Map<string, string>();

export const ChromaSticker: React.FC<ChromaStickerProps> = ({
  src,
  alt = 'สติกเกอร์กุ้ง',
  size = 'md',
  className = '',
  keyOutMagenta = true,
}) => {
  const safeSrc = src || FALLBACK_STICKER_SRC;
  const [processedSrc, setProcessedSrc] = useState<string>(
    transparentCache.get(safeSrc) || safeSrc
  );

  useEffect(() => {
    const activeSrc = src || FALLBACK_STICKER_SRC;

    if (!keyOutMagenta) {
      setProcessedSrc(activeSrc);
      return;
    }

    if (transparentCache.has(activeSrc)) {
      setProcessedSrc(transparentCache.get(activeSrc)!);
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Key out solid bright magenta (#FF00FF)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Magenta threshold check: high red, high blue, low green
          if (r > 180 && b > 180 && g < 100) {
            data[i + 3] = 0; // Transparent
          } else if (r > 160 && b > 160 && g < 130) {
            // Soft border transition
            const alphaFactor = Math.max(0, (g - 90) / 40);
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        transparentCache.set(activeSrc, dataUrl);

        if (isMounted) {
          setProcessedSrc(dataUrl);
        }
      } catch (err) {
        // Fallback to original image
        if (isMounted) {
          setProcessedSrc(activeSrc);
        }
      }
    };

    img.onerror = () => {
      if (isMounted) setProcessedSrc(FALLBACK_STICKER_SRC);
    };

    return () => {
      isMounted = false;
    };
  }, [src, keyOutMagenta]);

  const sizeStyles = () => {
    if (typeof size === 'number') {
      return { width: `${size}px`, height: `${size}px` };
    }
    const map = {
      xs: { width: '24px', height: '24px' },
      sm: { width: '34px', height: '34px' },
      md: { width: '48px', height: '48px' },
      lg: { width: '64px', height: '64px' },
      xl: { width: '82px', height: '82px' },
      '2xl': { width: '104px', height: '104px' },
      hero: { width: '136px', height: '136px' },
    };
    return map[size] || map.md;
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={sizeStyles()}
    >
      <img
        src={processedSrc || FALLBACK_STICKER_SRC}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          if (target && target.src !== FALLBACK_STICKER_SRC) {
            target.src = FALLBACK_STICKER_SRC;
          }
        }}
        className="w-full h-full object-contain filter drop-shadow-[0_6px_14px_rgba(255,122,26,0.18)]"
        loading="lazy"
      />
    </div>
  );
};
