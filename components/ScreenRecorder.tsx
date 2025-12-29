import React, { useRef, useState, useEffect } from 'react';
import { UploadedFile } from '../types';

interface ScreenRecorderProps {
  onImagesCaptured: (files: UploadedFile[]) => void;
  isAnalyzing: boolean;
}

const MAX_CAPTURES = 5;

const ScreenRecorder: React.FC<ScreenRecorderProps> = ({ onImagesCaptured, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  useEffect(() => {
    return () => stopStream();
  }, []);

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      mediaStream.getVideoTracks()[0].onended = () => stopStream();
    } catch (err) {
      console.error(err);
    }
  };

  const captureFrame = () => {
    if (capturedImages.length >= MAX_CAPTURES || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImages(prev => [...prev, canvas.toDataURL('image/png')]);
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const confirmSelection = async () => {
    if (capturedImages.length === 0) return;
    const processedFiles = await Promise.all(capturedImages.map(async (imgUrl, index) => {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      return {
        file: new File([blob], `capture-${index}.png`, { type: "image/png" }),
        previewUrl: imgUrl,
        base64: imgUrl.split(',')[1],
        mimeType: 'image/png'
      } as UploadedFile;
    }));
    stopStream();
    onImagesCaptured(processedFiles);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Media Player Container */}
      <div className="bg-gray-200 border border-gray-400 rounded-t-lg shadow-md overflow-hidden">
        
        {/* Player Header */}
        <div className="bg-gradient-to-b from-gray-700 to-black text-white px-3 py-1 text-xs font-bold flex justify-between">
           <span>Live Stream Source</span>
           <span>{stream ? 'Active' : 'Offline'}</span>
        </div>

        {/* Video Screen */}
        <div className="bg-black relative aspect-video flex items-center justify-center">
          <canvas ref={canvasRef} className="hidden" />
          
          {!stream ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-gray-600 flex items-center justify-center">
                 <div className="w-0 h-0 border-l-[10px] border-l-gray-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
              </div>
              <button 
                onClick={startCapture}
                className="btn-aqua px-4 py-1 text-xs font-bold"
              >
                Initialize Capture Device
              </button>
            </div>
          ) : (
             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
          )}
        </div>

        {/* Player Controls */}
        <div className="bg-gradient-to-b from-gray-300 to-gray-400 p-2 border-t border-gray-500 flex justify-center gap-4">
            {stream && (
              <button 
                 onClick={captureFrame}
                 disabled={capturedImages.length >= MAX_CAPTURES}
                 className="w-12 h-12 rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-800 shadow-lg flex items-center justify-center hover:brightness-110 active:translate-y-0.5 disabled:opacity-50 disabled:grayscale"
                 title="Capture Frame"
              >
                 <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_5px_white]"></div>
              </button>
            )}
        </div>
      </div>

      {/* Filmstrip / Gallery */}
      {capturedImages.length > 0 && (
         <div className="inset-panel p-2 flex gap-2 overflow-x-auto bg-gray-50 rounded">
            {capturedImages.map((img, idx) => (
               <div key={idx} className="relative shrink-0 group">
                  <img 
                    src={img} 
                    className="h-16 w-24 object-cover border border-gray-400 shadow-sm" 
                  />
                  <div className="absolute top-0 right-0 p-0.5">
                     <button 
                       onClick={() => removeImage(idx)}
                       className="bg-red-600 text-white w-4 h-4 flex items-center justify-center text-[10px] rounded shadow hover:bg-red-500"
                     >
                       ×
                     </button>
                  </div>
               </div>
            ))}
         </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
         <span className="self-center text-xs text-gray-500 mr-auto">
            {capturedImages.length} of {MAX_CAPTURES} frames selected
         </span>
         <button 
            onClick={confirmSelection}
            disabled={capturedImages.length === 0}
            className="btn-aqua px-6 py-2 font-bold text-sm disabled:opacity-50 disabled:grayscale"
         >
            Process Selection
         </button>
      </div>
    </div>
  );
};

export default ScreenRecorder;