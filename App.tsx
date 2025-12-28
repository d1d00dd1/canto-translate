import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import ResultsView from './components/ResultsView';
import { interpretScreenshot } from './services/geminiService';
import { UploadedFile, InterpretationResult, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Example placeholder for initial state visual
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageSelected = async (file: UploadedFile) => {
    setCurrentFile(file);
    setAppState(AppState.ANALYZING);
    setErrorMessage(null);

    try {
      const interpretation = await interpretScreenshot(file.base64, file.mimeType);
      setResult(interpretation);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMessage(error.message || "Failed to interpret the image. Please try again.");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentFile(null);
    setResult(null);
    setErrorMessage(null);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              CantoLingo
            </h1>
          </div>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">
            About
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Understand Cantonese Screenshots <br/>
            <span className="text-indigo-600">Instantly</span>
          </h2>
          <p className="text-lg text-slate-600">
            Upload a screenshot of a chat, menu, or document. We'll extract the Cantonese text and interpret it into natural English for you.
          </p>
        </div>

        {/* Dynamic Content Area */}
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Uploader or Preview */}
          {appState === AppState.IDLE && (
            <div className="animate-fade-in">
              <ImageUpload 
                onImageSelected={handleImageSelected} 
                isAnalyzing={false} 
              />
            </div>
          )}

          {(appState === AppState.ANALYZING || appState === AppState.SUCCESS || appState === AppState.ERROR) && currentFile && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-full md:w-1/3 aspect-[4/3] md:aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                  <img 
                    src={currentFile.previewUrl} 
                    alt="Uploaded screenshot" 
                    className="w-full h-full object-contain"
                  />
                  {appState === AppState.ANALYZING && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                       <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow text-center md:text-left space-y-2">
                   {appState === AppState.ANALYZING && (
                     <>
                        <h3 className="text-lg font-semibold text-slate-800 animate-pulse">Analyzing Image...</h3>
                        <p className="text-slate-500">Gemini is reading the traditional characters and translating context.</p>
                     </>
                   )}
                   {appState === AppState.SUCCESS && (
                     <>
                        <h3 className="text-lg font-semibold text-green-600">Analysis Complete</h3>
                        <p className="text-slate-500 text-sm">See the detailed translation below.</p>
                     </>
                   )}
                   {appState === AppState.ERROR && (
                     <>
                        <h3 className="text-lg font-semibold text-red-600">Error Occurred</h3>
                        <p className="text-slate-500 text-sm">{errorMessage}</p>
                        <button 
                          onClick={handleReset}
                          className="mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Try Again
                        </button>
                     </>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* Results Area */}
          {appState === AppState.SUCCESS && result && (
            <ResultsView result={result} onReset={handleReset} />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} CantoLingo Interpret. Powered by Google Gemini 3 Flash.
        </div>
      </footer>
    </div>
  );
};

export default App;
