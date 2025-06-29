import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { QuizNavigation } from '../components/quiz/QuizNavigation';
import { QuizResults } from '../components/quiz/QuizResults';
import { LoadingSpinner } from '../components/quiz/LoadingSpinner';
import { ErrorDisplay } from '../components/quiz/ErrorDisplay';
import { QuizSetup } from '../components/quiz/QuizSetup';
import { QuizSourceSelector } from '../components/quiz/QuizSourceSelector';
import { TimerDisplay } from '../components/quiz/TimerDisplay';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Brain, BookOpen, GraduationCap } from 'lucide-react';

function QuizAppContent() {
  const { t } = useLanguage();
  const {
    questions,
    allQuestions,
    currentQuestionIndex,
    selectedAnswers,
    score,
    isCompleted,
    isLoading,
    error,
    isConfiguring,
    mode,
    currentSourceName,
    timeLimit,
    timeRemaining,
    isTimerActive,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    restartQuiz,
    resetQuiz,
    loadQuestions,
    startQuiz,
    backToSetup,
  } = useQuiz();

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const hasSelectedAnswer = selectedAnswer !== null;
  const canGoNext = currentQuestionIndex < questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Source selection state (no questions loaded yet)
  if (allQuestions.length === 0 && !isLoading && !error) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('quiz.app.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('quiz.app.subtitle')}
            </p>
          </div>

          <QuizSourceSelector 
            onLoadQuestions={loadQuestions}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('quiz.app.title')}
            </h1>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('quiz.app.title')}
            </h1>
          </div>
          <ErrorDisplay 
            error={error} 
            onRetry={() => resetQuiz()}
          />
        </div>
      </div>
    );
  }

  // Setup/Configuration state
  if (isConfiguring && allQuestions.length > 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizSetup 
            totalQuestions={allQuestions.length}
            onStart={startQuiz}
            onBack={resetQuiz}
            sourceName={currentSourceName}
          />
        </div>
      </div>
    );
  }

  // Quiz in progress or completed - FULLSCREEN MODE (no header/footer)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {isCompleted ? (
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentSourceName}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {mode === 'study' ? t('quiz.question.studyMode') : t('quiz.question.examMode')}
                </p>
              </div>

              <QuizResults
                score={score}
                totalQuestions={questions.length}
                onRestart={restartQuiz}
                onReset={backToSetup}
                questions={questions}
                selectedAnswers={selectedAnswers}
                mode={mode}
                timeLimit={timeLimit}
                timeRemaining={timeRemaining}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Fixed Header with Back Button and Timer */}
          <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 px-4 py-3 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={backToSetup}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t('quiz.navigation.backToSetup')}</span>
                <span className="sm:hidden">{t('common.back')}</span>
              </button>
              
              {/* Title with Mode Info */}
              <div className="text-center flex-1 mx-4">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentSourceName}
                </h1>
                {/* Mode Information - Compact Display */}
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    {mode === 'study' ? (
                      <>
                        <BookOpen className="w-3 h-3" />
                        <span>{t('quiz.question.studyMode')}</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-3 h-3" />
                        <span>{t('quiz.question.examMode')}</span>
                      </>
                    )}
                  </div>
                  {timeLimit && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{timeLimit} {t('quiz.setup.minutes')}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Timer - Compact Display */}
              <div className="flex items-center">
                <TimerDisplay 
                  timeRemaining={timeRemaining}
                  isActive={isTimerActive}
                  mode={mode}
                />
              </div>
            </div>
          </div>

          {/* Main Content with Top Padding for Fixed Header */}
          <div className="flex-1 max-w-4xl mx-auto px-4 py-6 pb-24 w-full pt-20">
            {/* Question Section - No Progress Bar */}
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={selectAnswer}
              showResults={false}
              mode={mode}
            />
          </div>

          {/* Fixed Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <QuizNavigation
                currentQuestion={currentQuestionIndex}
                totalQuestions={questions.length}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
                hasSelectedAnswer={hasSelectedAnswer}
                isLastQuestion={isLastQuestion}
                onNext={nextQuestion}
                onPrevious={previousQuestion}
                onFinish={finishQuiz}
                mode={mode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const QuizApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<QuizAppContent />} />
    </Routes>
  );
};