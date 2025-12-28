import React from 'react';
import { InterpretationResult } from '../types';

interface ResultsViewProps {
  result: InterpretationResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  return (
    <div className="w-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Interpretation Complete
          </h2>
          <button 
            onClick={onReset}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Start Over
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid gap-8 md:grid-cols-2">
          
          {/* Cantonese Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Original Cantonese
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-lg md:text-xl text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
              {result.cantonese}
            </div>
          </div>

          {/* English Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              English Translation
            </h3>
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-lg md:text-xl text-indigo-900 font-medium leading-relaxed whitespace-pre-wrap">
              {result.english}
            </div>
          </div>

        </div>

        {/* Notes Section (if available) */}
        {result.notes && (
          <div className="px-6 pb-6">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-amber-800">
                <span className="font-bold block mb-1">Context Notes</span>
                {result.notes}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
