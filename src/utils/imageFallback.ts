import React from 'react';
import { STICKERS, STICKER_MAP } from '../assets/stickers';

export const FALLBACK_STICKER_SRC = '/src/assets/images/shrimp_logo_sticker_1794416778119.jpg';
export const FALLBACK_SHRIMP_IMG = '/src/assets/images/real_shrimp_vannamei_1794481099500.jpg';
export const FALLBACK_FARM_IMG = '/src/assets/images/real_farm_landscape_1794481102462.jpg';

/**
 * Safely resolves sticker source by key or object without ever throwing reading 'src' of undefined
 */
export function getSafeStickerSrc(keyOrObj?: any, fallback = FALLBACK_STICKER_SRC): string {
  if (!keyOrObj) return fallback;
  if (typeof keyOrObj === 'string') {
    // If it's already an image URL/path
    if (keyOrObj.startsWith('/') || keyOrObj.startsWith('http') || keyOrObj.startsWith('data:')) {
      return keyOrObj;
    }
    const found = STICKER_MAP?.[keyOrObj];
    return found?.src || STICKER_MAP?.pond?.src || STICKER_MAP?.logo?.src || fallback;
  }
  return keyOrObj?.src || keyOrObj?.image?.src || keyOrObj?.image || keyOrObj?.cover || fallback;
}

/**
 * Safely resolves any photo/image string or object
 */
export function getSafeImage(imgOrObj: any, fallback = FALLBACK_SHRIMP_IMG): string {
  if (!imgOrObj) return fallback;
  if (typeof imgOrObj === 'string') return imgOrObj;
  return (
    imgOrObj?.src ||
    imgOrObj?.image?.src ||
    imgOrObj?.image ||
    imgOrObj?.realImg ||
    imgOrObj?.heroImg ||
    imgOrObj?.cover ||
    fallback
  );
}

/**
 * Image error handler to automatically replace broken image with fallback
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = FALLBACK_SHRIMP_IMG
) {
  const target = e.currentTarget;
  if (target && target.src !== fallback) {
    target.onerror = null; // Prevent loop
    target.src = fallback;
  }
}
