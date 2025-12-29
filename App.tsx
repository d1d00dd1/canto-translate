import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import ScreenRecorder from './components/ScreenRecorder';
import ResultsView from './components/ResultsView';
import { interpretScreenshots } from './services/geminiService';
import { UploadedFile, InterpretationResult, AppState } from './types';

type InputMode = 'upload' | 'screen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [currentFiles, setCurrentFiles] = useState<UploadedFile[]>([]);
  const [results, setResults] = useState<InterpretationResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const processFiles = async (files: UploadedFile[]) => {
    setCurrentFiles(files);
    setAppState(AppState.ANALYZING);
    setErrorMessage(null);

    try {
      const imagesForService = files.map(f => ({
        base64: f.base64,
        mimeType: f.mimeType
      }));
      
      const interpretations = await interpretScreenshots(imagesForService);
      setResults(interpretations);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMessage(error.message || "A system error occurred during interpretation.");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentFiles([]);
    setResults([]);
    setErrorMessage(null);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      {/* Main Application Window */}
      <div className="aero-window w-full max-w-5xl flex flex-col shadow-2xl" style={{minHeight: '600px'}}>
        
        {/* Window Title Bar */}
        <div className="aero-titlebar flex justify-between items-center select-none cursor-default">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shadow-sm border border-blue-700"></div>
            <span className="font-bold text-gray-700 text-sm tracking-wide drop-shadow-sm">CantoLingo v2.0 Professional</span>
          </div>
          <div className="flex gap-1">
             <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400"></div>
             <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400"></div>
             <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500 hover:bg-red-500 cursor-pointer"></div>
          </div>
        </div>

        {/* Toolbar / Menu */}
        <div className="bg-gradient-to-b from-white to-gray-100 border-b border-gray-300 px-4 py-2 flex items-center gap-4">
           <button 
             onClick={handleReset}
             className="text-xs text-gray-600 hover:bg-blue-50 px-2 py-1 rounded border border-transparent hover:border-blue-200 transition-colors"
           >
             File
           </button>
           <button className="text-xs text-gray-600 hover:bg-blue-50 px-2 py-1 rounded border border-transparent hover:border-blue-200 transition-colors">
             Edit
           </button>
           <button className="text-xs text-gray-600 hover:bg-blue-50 px-2 py-1 rounded border border-transparent hover:border-blue-200 transition-colors">
             View
           </button>
           <div className="h-4 w-px bg-gray-300 mx-2"></div>
           <span className="text-xs text-gray-400">Status: {appState}</span>
        </div>

        {/* Workspace Content */}
        <div className="flex-grow p-6 bg-white/50 relative">
          
          <div className="mb-6 flex flex-col items-center">
             <h1 className="text-4xl font-bold shine-text mb-2 tracking-tighter">CantoLingo</h1>
             <p className="text-gray-500 text-sm">Cantonese Optical Character Recognition & Translation Engine</p>
          </div>

          {/* Tab Navigation (Only in IDLE) */}
          {appState === AppState.IDLE && (
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-200 p-1 rounded-full shadow-inner border border-gray-300">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${
                    inputMode === 'upload' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Import Images
                </button>
                <button
                  onClick={() => setInputMode('screen')}
                  className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${
                    inputMode === 'screen' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Screen Capture
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white border border-gray-300 shadow-sm p-1 rounded-lg">
             <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded p-6 min-h-[400px] flex flex-col justify-center">
                
                {appState === AppState.IDLE && (
                   <div className="w-full max-w-3xl mx-auto">
                     {inputMode === 'upload' ? (
                       <ImageUpload 
                         onImagesSelected={processFiles} 
                         isAnalyzing={false} 
                       />
                     ) : (
                       <ScreenRecorder 
                         onImagesCaptured={processFiles} 
                         isAnalyzing={false} 
                       />
                     )}
                   </div>
                )}

                {/* Processing State with Windows XP style loading bar */}
                {appState === AppState.ANALYZING && (
                  <div className="w-full max-w-md mx-auto text-center">
                     <div className="mb-4 text-gray-700 font-bold">Processing Data...</div>
                     <div className="w-full h-4 bg-gray-200 border border-gray-400 rounded overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-b from-green-400 to-green-600 animate-[move_2s_linear_infinite]"></div>
                     </div>
                     <style>{`
                        @keyframes move { 0% { left: -33%; } 100% { left: 100%; } }
                     `}</style>
                     <div className="mt-2 text-xs text-gray-500 text-left">
                        Reading binaries...<br/>
                        Connecting to Gemini Neural Net...
                     </div>
                  </div>
                )}

                {/* Error State */}
                {appState === AppState.ERROR && (
                   <div className="flex flex-col items-center">
                      <div className="w-16 h-16 mb-4">
                         <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="22" fill="#E53935" stroke="#B71C1C" strokeWidth="2"/>
                            <path d="M14 14L34 34M34 14L14 34" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                         </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Critical Error</h3>
                      <p className="text-gray-600 my-4 text-center bg-yellow-50 p-2 border border-yellow-200 text-sm">
                        {errorMessage}
                      </p>
                      <button onClick={handleReset} className="btn-aqua px-6 py-2 text-sm font-bold">
                        Restart Application
                      </button>
                   </div>
                )}

                {/* Results State */}
                {appState === AppState.SUCCESS && (
                   <ResultsView results={results} images={currentFiles} onReset={handleReset} />
                )}

             </div>
          </div>

        </div>

        {/* Status Bar */}
        <div className="bg-gray-100 border-t border-gray-300 px-3 py-1 flex justify-between items-center text-[11px] text-gray-500 font-sans">
           <span>Ready</span>
           <div className="flex gap-4">
             <span className="border-l border-gray-300 pl-2">Mem: 64MB</span>
             <span className="border-l border-gray-300 pl-2">Ln 1, Col 1</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;