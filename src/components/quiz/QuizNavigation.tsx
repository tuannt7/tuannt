import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  hasSelectedAnswer: boolean;
  isLastQuestion: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
  mode: 'study' | 'exam';
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  canGoNext,
  canGoPrevious,
  hasSelectedAnswer,
  isLastQuestion,
  onNext,
  onPrevious,
  onFinish,
  mode,
}) => {
  const { t } = useLanguage();

  const handleNext = () => {
    if (isLastQuestion) {
      onFinish();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          canGoPrevious
            ? 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            : 'text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{t('quiz.navigation.previous')}</span>
        <span className="sm:hidden">{t('common.back')}</span>
      </button>

      {/* Progress Info */}
      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">
          {t('quiz.navigation.questionCounter', { 
            current: currentQuestion + 1, 
            total: totalQuestions 
          })}
        </span>
        <span className="hidden sm:inline text-xs">
          {t('quiz.navigation.progressComplete', { 
            percentage: Math.round(((currentQuestion + 1) / totalQuestions) * 100)
          })}
        </span>
      </div>

      {/* Next/Finish Button */}
      <button
        onClick={handleNext}
        disabled={mode === 'study' && !hasSelectedAnswer}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          (mode === 'exam' || hasSelectedAnswer)
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLastQuestion ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">
              {mode === 'study' ? t('quiz.navigation.finish') : t('quiz.navigation.submit')}
            </span>
            <span className="sm:hidden">
              {mode === 'study' ? t('quiz.navigation.finish') : t('quiz.navigation.submit')}
            </span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">{t('quiz.navigation.next')}</span>
            <span className="sm:hidden">{t('quiz.navigation.next')}</span>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};