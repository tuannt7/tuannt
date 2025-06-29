import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {t('quiz.error.title')}
        </h3>
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-300 text-sm whitespace-pre-wrap break-words">
            {error}
          </p>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-5 h-5" />
        <span>{t('quiz.error.backToSource')}</span>
      </button>
    </div>
  );
};