import { Sparkles, LoaderCircle, ChevronUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export default function AIAnalysisCard({ analysis, isAnalyzing }) {
  const [isVisible, setIsVisible] = useState(true);

  if (isAnalyzing) {
    return (
      <div className="bg-indigo-50 dark:bg-slate-800/50 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400">
          <LoaderCircle className="w-6 h-6 animate-spin" />
          <p className="font-medium">Analizando tus finanzas...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          Análisis con IA
        </h3>
        <button onClick={() => setIsVisible(!isVisible)} className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
          {isVisible ? <><ChevronUp className="w-4 h-4" /> Ocultar</> : <><ChevronDown className="w-4 h-4" /> Mostrar</>}
        </button>
      </div>
      {isVisible && (
        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:my-2 prose-li:my-1 pt-2 border-t border-slate-100 dark:border-slate-800/50">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}