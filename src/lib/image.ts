// Image utilities — used by RecipeCreator to compress user-uploaded photos
// before stashing them as base64 in localStorage. Without this, a single
// 4 MB phone photo blows past the ~5 MB origin quota.

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.82;
const MAX_INPUT_BYTES = 15 * 1024 * 1024; // 15 MB — reject obviously-too-big files upfront

export interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
  approxKB: number;
}

export class ImageProcessingError extends Error {}

/**
 * Reads a File, resizes the longer edge to `MAX_DIMENSION` keeping aspect
 * ratio, and re-encodes as JPEG. Returns a base64 data URL ready for
 * persistence. Rejects on unsupported MIME types or read failure.
 */
export async function processRecipeImage(file: File): Promise<ProcessedImage> {
  if (!file.type.startsWith('image/')) {
    throw new ImageProcessingError('Можно загружать только изображения.');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageProcessingError('Файл слишком большой (максимум 15 МБ).');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);

    const longest = Math.max(image.naturalWidth, image.naturalHeight);
    const scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1;
    const width = Math.round(image.naturalWidth * scale);
    const height = Math.round(image.naturalHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new ImageProcessingError('Браузер не поддерживает обработку изображений.');
    }
    ctx.drawImage(image, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    if (!dataUrl.startsWith('data:image/jpeg')) {
      throw new ImageProcessingError('Не удалось сжать изображение.');
    }

    const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1;
    const approxKB = Math.round((base64Length * 3) / 4 / 1024);

    return { dataUrl, width, height, approxKB };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageProcessingError('Не удалось прочитать файл.'));
    img.src = src;
  });
}
