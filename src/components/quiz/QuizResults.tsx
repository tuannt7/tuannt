import React, { useState } from 'react';
import { Trophy, RotateCcw, Home, ChevronDown, ChevronUp, Clock, Target } from 'lucide-react';
import { Question } from '../../types/quiz';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onReset: () => void;
  questions: Question[];
  selectedAnswers: (number | null)[];
  mode: 'study' | 'exam';
  timeLimit: number | null;
  timeRemaining: number | null;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart,
  onReset,
  questions,
  selectedAnswers,
  mode,
  timeLimit,
  timeRemaining,
}) => {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - score;
  
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: t('quiz.results.excellent'), color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/50' };
    if (percentage >= 75) return { level: t('quiz.results.good'), color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/50' };
    if (percentage >= 60) return { level: t('quiz.results.fair'), color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/50' };
    return { level: t('quiz.results.needsImprovement'), color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/50' };
  };

  const performance = getPerformanceLevel(percentage);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const timeUsed = timeLimit && timeRemaining !== null 
    ? (timeLimit * 60) - timeRemaining 
    : null;

  const isTimeUp = timeRemaining === 0;

  // Helper function to get option styling
  const getOptionStyle = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const selectedAnswer = selectedAnswers[questionIndex];
    const isCorrect = optionIndex === question.correct;
    const isSelected = selectedAnswer === optionIndex;

    if (isCorrect && isSelected) {
      // Correct answer and user selected it
      return 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300';
    } else if (isCorrect && !isSelected) {
      // Correct answer but user didn't select it
      return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
    } else if (!isCorrect && isSelected) {
      // Wrong answer and user selected it
      return 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300';
    } else {
      // Wrong answer and user didn't select it
      return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300';
    }
  };

  // Helper function to get option icon
  const getOptionIcon = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const selectedAnswer = selectedAnswers[questionIndex];
    const isCorrect = optionIndex === question.correct;
    const isSelected = selectedAnswer === optionIndex;

    if (isCorrect && isSelected) {
      return '✓'; // Correct and selected
    } else if (isCorrect && !isSelected) {
      return '✓'; // Correct but not selected
    } else if (!isCorrect && isSelected) {
      return '✗'; // Wrong and selected
    } else {
      return '○'; // Wrong and not selected
    }
  };

  return (
    <div className="pb-24">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {mode === 'study' ? t('quiz.results.studyComplete') : t('quiz.results.examComplete')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isTimeUp ? t('quiz.results.timeUpMessage') : t('quiz.results.performance')}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-2">
              {percentage}%
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${performance.bgColor}`}>
              <span className={`font-semibold ${performance.color}`}>
                {performance.level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('quiz.results.correctAnswers')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{incorrectAnswers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('quiz.results.incorrectAnswers')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalQuestions}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('quiz.results.totalQuestions')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('quiz.results.score')}</div>
            </div>
          </div>

          {/* Time Information */}
          {timeLimit && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {t('quiz.results.timeInformation')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-300">
                    {timeLimit} {t('quiz.setup.minutes')}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">{t('quiz.results.timeAllowed')}</div>
                </div>
                {timeUsed !== null && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
                    <div className="text-lg font-bold text-green-900 dark:text-green-300">
                      {formatTime(timeUsed)}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">{t('quiz.results.timeUsed')}</div>
                  </div>
                )}
                <div className={`p-3 rounded-lg ${isTimeUp ? 'bg-red-50 dark:bg-red-900/50' : 'bg-yellow-50 dark:bg-yellow-900/50'}`}>
                  <div className={`text-lg font-bold ${isTimeUp ? 'text-red-900 dark:text-red-300' : 'text-yellow-900 dark:text-yellow-300'}`}>
                    {isTimeUp ? t('quiz.results.timeUp') : formatTime(timeRemaining || 0)}
                  </div>
                  <div className={`text-sm ${isTimeUp ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {t('quiz.results.timeRemaining')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Results Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>
              {showDetails ? t('quiz.results.hideDetails') : t('quiz.results.showDetails')}
            </span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Detailed Results */}
        {showDetails && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              {t('quiz.results.detailedResults')}
            </h2>
            
            <div className="space-y-8">
              {questions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[questionIndex];
                const isCorrect = selectedAnswer === question.correct;
                
                return (
                  <div
                    key={questionIndex}
                    className={`p-6 rounded-lg border-2 ${
                      isCorrect 
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30' 
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start space-x-3 mb-6">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {t('quiz.progress.question', { current: questionIndex + 1, total: totalQuestions })}
                        </h3>
                        <div 
                          className="text-gray-700 dark:text-gray-300 mb-4 [&_img]:mx-auto [&_img]:my-2 [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:max-h-32 [&_img]:rounded [&_img]:shadow-sm [&_code]:bg-gray-100 [&_code]:dark:bg-gray-700 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:text-gray-800 [&_code]:dark:text-gray-200 [&_strong]:font-semibold [&_em]:italic [&_p]:mb-2 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1 [&_pre]:bg-gray-100 [&_pre]:dark:bg-gray-700 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-gray-800 [&_pre]:dark:text-gray-200"
                          dangerouslySetInnerHTML={{ __html: question.question }}
                        />
                      </div>
                    </div>

                    {/* All Options Display */}
                    <div className="ml-11 space-y-3 mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">{t('quiz.results.allAnswers')}</h4>
                      {question.options.map((option, optionIndex) => {
                        const isCorrectOption = optionIndex === question.correct;
                        const isSelectedOption = selectedAnswer === optionIndex;
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${getOptionStyle(questionIndex, optionIndex)}`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-sm font-bold">
                                {getOptionIcon(questionIndex, optionIndex)}
                              </span>
                              <div className="flex-1">
                                <div 
                                  className="[&_img]:inline-block [&_img]:my-1 [&_img]:max-h-32 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:shadow-sm [&_img]:align-middle [&_code]:bg-blue-200 [&_code]:dark:bg-blue-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-blue-800 [&_code]:dark:text-blue-200 [&_strong]:font-semibold [&_em]:italic [&_p]:mb-0"
                                  dangerouslySetInnerHTML={{ __html: option }}
                                />
                                
                                {/* Status Labels */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {isCorrectOption && (
                                    <span className="inline-flex items-center px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                                      {t('quiz.results.correctAnswer')}
                                    </span>
                                  )}
                                  {isSelectedOption && (
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                      isCorrectOption 
                                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-300' 
                                        : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-300'
                                    }`}>
                                      {t('quiz.results.yourAnswer')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* User's Answer Summary */}
                    <div className="ml-11 mb-4">
                      {selectedAnswer !== null ? (
                        <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                          <span className="font-medium text-gray-900 dark:text-white">{t('quiz.results.result')} </span>
                          <span className={`font-semibold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? t('quiz.question.correct') : t('quiz.question.incorrect')}
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{t('quiz.results.noAnswer')}</span>
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="ml-11">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">💡 {t('quiz.results.explanation')}</h5>
                          <div 
                            className="text-blue-700 dark:text-blue-300 [&_img]:mx-auto [&_img]:my-2 [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:max-h-32 [&_img]:rounded [&_img]:shadow-sm [&_code]:bg-blue-200 [&_code]:dark:bg-blue-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-blue-800 [&_code]:dark:text-blue-200 [&_strong]:font-semibold [&_em]:italic [&_p]:mb-2 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-1 [&_pre]:bg-blue-200 [&_pre]:dark:bg-blue-800 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-blue-800 [&_pre]:dark:text-blue-200"
                            dangerouslySetInnerHTML={{ __html: question.explanation }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Action Buttons at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t('quiz.results.tryAgain')}</span>
            </button>
            
            <button
              onClick={onReset}
              className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span>{t('quiz.results.loadNewQuiz')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};