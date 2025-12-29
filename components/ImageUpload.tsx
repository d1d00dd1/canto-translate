import React, { useRef, useState } from 'react';
import { UploadedFile } from '../types';
import { processFiles } from '../utils/imageUtils';

interface ImageUploadProps {
  onImagesSelected: (files: UploadedFile[]) => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesSelected, isAnalyzing }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (isAnalyzing) return;
    const files = Array.from(e.dataTransfer.files) as File[];
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length > 0) {
      const processed = await processFiles(validFiles);
      onImagesSelected(processed);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      className={`
        w-full h-[320px] rounded-xl transition-all duration-300 cursor-pointer
        flex flex-col items-center justify-center gap-4 border-2
        ${isHovered 
          ? 'bg-blue-50 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'bg-gradient-to-b from-white to-gray-50 border-gray-300 hover:border-blue-300'}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        className="hidden"
        accept="image/*"
        multiple
        disabled={isAnalyzing}
      />

      {/* Glossy Icon Representation */}
      <div className={`
        w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center
        shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)] border border-blue-700
        transition-transform duration-300 ${isHovered ? 'scale-110' : ''}
      `}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div className="text-center space-y-2">
         <h3 className="text-lg font-bold text-gray-700">
           Select or Drop Images
         </h3>
         <p className="text-gray-500 text-xs">
           Supports .PNG, .JPG, .WEBP
         </p>
         
         <div className="btn-aqua px-6 py-2 text-sm font-bold inline-block mt-2">
            Browse Computer...
         </div>
      </div>
    </div>
  );
};

export default ImageUpload;