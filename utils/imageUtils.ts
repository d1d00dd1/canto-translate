import { UploadedFile } from '../types';

export const processFile = (file: File): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64 = result.split(',')[1];
      resolve({
        file,
        previewUrl: result,
        base64,
        mimeType: file.type,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
