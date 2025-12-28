import React, { useRef, useState } from 'react';
import { UploadedFile } from '../types';
import { processFile } from '../utils/imageUtils';

interface ImageUploadProps {
  onImageSelected: (file: UploadedFile) => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isAnalyzing) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    try {
      const processed = await processFile(file);
      onImageSelected(processed);
    } catch (err) {
      console.error("Error processing file", err);
    }
  };

  const triggerSelect = () => {
    if (!isAnalyzing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerSelect}
      className={`
        relative group cursor-pointer 
        border-2 border-dashed rounded-2xl p-10 
        flex flex-col items-center justify-center text-center 
        transition-all duration-300 ease-in-out
        ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' 
          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 bg-white shadow-sm'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept="image/*"
        disabled={isAnalyzing}
      />
      
      <div className={`p-4 rounded-full bg-indigo-100 mb-4 transition-transform group-hover:scale-110 ${isDragging ? 'scale-110' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        Upload Screenshot
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Drag and drop your Cantonese screenshot here, or click to browse.
      </p>
    </div>
  );
};

export default ImageUpload;
