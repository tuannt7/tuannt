import React from 'react';
import { Question } from '../../types/quiz';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  showResults: boolean;
  mode: 'study' | 'exam';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResults,
  mode,
}) => {
  const { t } = useLanguage();

  const getOptionClass = (optionIndex: number) => {
    const baseClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md";
    
    // In study mode, show colors immediately when answer is selected
    if (mode === 'study' && selectedAnswer !== null) {
      if (optionIndex === question.correct) {
        // Correct answer - always green
        return `${baseClass} border-green-500 bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200`;
      } else if (selectedAnswer === optionIndex) {
        // Selected wrong answer - red
        return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200`;
      } else {
        // Other options - gray
        return `${baseClass} border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200`;
      }
    }

    // In exam mode or when no answer selected
    if (selectedAnswer === null) {
      return `${baseClass} border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-700 dark:text-gray-200 hover:text-blue-800 dark:hover:text-blue-200`;
    }

    if (selectedAnswer === optionIndex) {
      if (showResults) {
        return optionIndex === question.correct
          ? `${baseClass} border-green-500 bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200`
          : `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200`;
      }
      return `${baseClass} border-blue-500 bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200`;
    }

    if (showResults && optionIndex === question.correct) {
      return `${baseClass} border-green-500 bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200`;
    }

    return `${baseClass} border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200`;
  };

  const getOptionIcon = (optionIndex: number) => {
    // In study mode, show check/cross immediately when answer is selected
    if (mode === 'study' && selectedAnswer !== null) {
      if (optionIndex === question.correct) {
        return '✓';
      } else if (selectedAnswer === optionIndex) {
        return '✗';
      } else {
        return '○';
      }
    }

    // In exam mode or when no answer selected
    if (!showResults) {
      return selectedAnswer === optionIndex ? '●' : '○';
    }

    if (optionIndex === question.correct) {
      return '✓';
    }

    if (selectedAnswer === optionIndex && optionIndex !== question.correct) {
      return '✗';
    }

    return '○';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          <div 
            className="[&_img]:mx-auto [&_img]:my-2 [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:max-h-32 [&_img]:rounded [&_img]:shadow-sm [&_img]:align-middle [&_code]:bg-gray-100 [&_code]:dark:bg-gray-700 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:text-gray-800 [&_code]:dark:text-gray-200 [&_strong]:font-semibold [&_em]:italic [&_p]:mb-2 [&_p]:inline [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1 [&_pre]:bg-gray-100 [&_pre]:dark:bg-gray-700 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-gray-800 [&_pre]:dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: question.question }}
          />
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            disabled={showResults}
            className={getOptionClass(index)}
          >
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-sm font-bold">
                {getOptionIcon(index)}
              </span>
              <span 
                className="flex-1 text-left [&_img]:inline-block [&_img]:my-1 [&_img]:max-h-32 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:shadow-sm [&_img]:align-middle [&_code]:bg-blue-200 [&_code]:dark:bg-blue-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-blue-800 [&_code]:dark:text-blue-200 [&_strong]:font-semibold [&_em]:italic [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: option }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Show feedback in study mode - only explanation without redundant text */}
      {mode === 'study' && selectedAnswer !== null && question.explanation && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('quiz.question.explanation')}</p>
            <div 
              className="text-blue-700 dark:text-blue-300 [&_img]:mx-auto [&_img]:my-2 [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:max-h-32 [&_img]:rounded-lg [&_img]:shadow-sm [&_code]:bg-blue-200 [&_code]:dark:bg-blue-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:text-blue-800 [&_code]:dark:text-blue-200 [&_strong]:font-semibold [&_em]:italic [&_p]:mb-2 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1 [&_pre]:bg-blue-200 [&_pre]:dark:bg-blue-800 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-blue-800 [&_pre]:dark:text-blue-200"
              dangerouslySetInnerHTML={{ __html: question.explanation }}
            />
          </div>
        </div>
      )}
    </div>
  );
};