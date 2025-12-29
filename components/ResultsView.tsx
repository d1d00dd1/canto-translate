import React from 'react';
import { InterpretationResult, UploadedFile } from '../types';

interface ResultsViewProps {
  results: InterpretationResult[];
  images: UploadedFile[];
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, images, onReset }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-lg font-bold text-gray-700">Analysis Report</h2>
         <button 
           onClick={onReset}
           className="btn-aqua secondary px-3 py-1 text-xs"
         >
           Clear Data
         </button>
      </div>

      {/* Data Grid Header */}
      <div className="grid grid-cols-12 gap-0 text-xs font-bold text-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-400 rounded-t-lg">
         <div className="col-span-3 p-2 border-r border-gray-300">Source Asset</div>
         <div className="col-span-9 p-2">Interpretation Data</div>
      </div>

      {/* Data Rows */}
      <div className="border-l border-r border-b border-gray-400 bg-white">
        {results.map((result, index) => {
          const image = images[index];
          const isEven = index % 2 === 0;
          return (
            <div key={index} className={`grid grid-cols-12 gap-0 ${isEven ? 'bg-white' : 'bg-blue-50/30'}`}>
               
               {/* Source Image Cell */}
               <div className="col-span-3 p-2 border-r border-gray-300 flex flex-col items-center justify-center border-b border-gray-200">
                  {image && (
                    <div className="p-1 bg-white border border-gray-300 shadow-sm mb-1">
                       <img src={image.previewUrl} className="max-h-24 max-w-full object-contain" />
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 font-mono">ID: IMG_{1000 + index}</span>
               </div>

               {/* Data Content Cell */}
               <div className="col-span-9 p-4 border-b border-gray-200">
                  <div className="mb-3">
                     <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">Original Input (Cantonese)</span>
                     <div className="text-lg font-serif text-gray-800 leading-relaxed bg-white border border-gray-200 p-2 inset-shadow">
                        {result.cantonese}
                     </div>
                  </div>
                  
                  <div className="mb-2">
                     <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block mb-0.5">Translation Output (English)</span>
                     <div className="text-base font-sans text-gray-900">
                        {result.english}
                     </div>
                  </div>

                  {result.notes && (
                     <div className="mt-3 flex gap-2 items-start bg-yellow-50 border border-yellow-200 p-2 rounded">
                        <div className="w-4 h-4 bg-yellow-400 text-white rounded-full flex items-center justify-center text-[10px] font-bold">i</div>
                        <p className="text-xs text-gray-600 italic">
                           {result.notes}
                        </p>
                     </div>
                  )}
               </div>

            </div>
          );
        })}
      </div>

      <div className="bg-gray-100 border border-gray-400 border-t-0 p-2 text-right text-xs text-gray-500 rounded-b-lg">
         Total Records: {results.length}
      </div>
    </div>
  );
};

export default ResultsView;