import React, { useState } from 'react';
import { Play, Settings, Clock, Shuffle, BookOpen, GraduationCap, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuizSetupProps {
  totalQuestions: number;
  onStart: (config: {
    questionCount: number | 'all';
    randomize: boolean;
    mode: 'study' | 'exam';
    timeLimit: number | null;
  }) => void;
  onBack: () => void;
  sourceName: string;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ 
  totalQuestions, 
  onStart, 
  onBack, 
  sourceName 
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'study' | 'exam'>('study');
  const [questionCount, setQuestionCount] = useState<number | 'all'>('all');
  const [customQuestionCount, setCustomQuestionCount] = useState<string>('');
  const [randomize, setRandomize] = useState(false);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [customTimeLimit, setCustomTimeLimit] = useState<string>('');

  // Get configuration from environment variables
  const DEFAULT_TIME_LIMIT = parseInt(import.meta.env.VITE_QUIZ_DEFAULT_TIME_LIMIT || '30');
  const MAX_TIME_LIMIT = parseInt(import.meta.env.VITE_QUIZ_MAX_TIME_LIMIT || '180');
  const MIN_QUESTIONS = parseInt(import.meta.env.VITE_QUIZ_MIN_QUESTIONS || '1');
  const MAX_CUSTOM_QUESTIONS = parseInt(import.meta.env.VITE_QUIZ_MAX_CUSTOM_QUESTIONS || '100');

  const handleStart = () => {
    const finalQuestionCount = questionCount === 'all' 
      ? 'all' 
      : questionCount === 'custom' 
        ? Math.min(parseInt(customQuestionCount) || totalQuestions, totalQuestions)
        : questionCount;

    const finalTimeLimit = timeLimit === 0 
      ? null 
      : timeLimit === -1 
        ? parseInt(customTimeLimit) || null
        : timeLimit;

    onStart({
      questionCount: finalQuestionCount,
      randomize,
      mode,
      timeLimit: finalTimeLimit,
    });
  };

  return (
    <div className="pb-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Section */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('quiz.setup.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {sourceName}
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/50 rounded-full">
            <span className="text-blue-800 dark:text-blue-300 font-medium">
              {t('quiz.setup.questionsAvailable', { count: totalQuestions })}
            </span>
          </div>
        </div>

        {/* Quiz Mode Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('quiz.setup.chooseMode')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setMode('study')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-center ${
                mode === 'study'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <BookOpen className={`w-8 h-8 ${mode === 'study' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                <h3 className={`font-semibold text-lg ${mode === 'study' ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                  {t('quiz.setup.studyModeTitle')}
                </h3>
                <p className={`text-sm ${mode === 'study' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  {t('quiz.setup.studyModeDesc')}
                </p>
              </div>
            </button>

            <button
              onClick={() => setMode('exam')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-center ${
                mode === 'exam'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/50'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <GraduationCap className={`w-8 h-8 ${mode === 'exam' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                <h3 className={`font-semibold text-lg ${mode === 'exam' ? 'text-purple-900 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>
                  {t('quiz.setup.examModeTitle')}
                </h3>
                <p className={`text-sm ${mode === 'exam' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  {t('quiz.setup.examModeDesc')}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Combined Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-8">
          {/* Time Limit Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {t('quiz.setup.timeLimit')}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="timeLimit"
                  checked={timeLimit === null}
                  onChange={() => setTimeLimit(null)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{t('quiz.setup.noTimeLimit')}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('quiz.setup.noTimeLimitDesc')}</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="timeLimit"
                  checked={timeLimit === -1}
                  onChange={() => setTimeLimit(-1)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{t('quiz.setup.customTimeLimit')}</div>
                  {timeLimit === -1 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={customTimeLimit}
                        onChange={(e) => setCustomTimeLimit(e.target.value)}
                        placeholder={t('quiz.setup.customTimePlaceholder')}
                        min={MIN_QUESTIONS}
                        max={MAX_TIME_LIMIT}
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <span className="text-gray-600 dark:text-gray-300">{t('quiz.setup.minutes')}</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Question Count Section */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {t('quiz.setup.questionCount')}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="questionCount"
                  checked={questionCount === 'all'}
                  onChange={() => setQuestionCount('all')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{t('quiz.setup.allQuestions')}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {t('quiz.setup.allQuestionsDesc', { count: totalQuestions })}
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="questionCount"
                  checked={questionCount === 'custom'}
                  onChange={() => setQuestionCount('custom')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{t('quiz.setup.customNumber')}</div>
                  {questionCount === 'custom' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={customQuestionCount}
                        onChange={(e) => setCustomQuestionCount(e.target.value)}
                        placeholder={t('quiz.setup.customPlaceholder')}
                        min={MIN_QUESTIONS}
                        max={Math.min(totalQuestions, MAX_CUSTOM_QUESTIONS)}
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <span className="text-gray-600 dark:text-gray-300">{t('quiz.setup.questions')}</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Options Section */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {t('quiz.setup.options')}
            </h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={randomize}
                onChange={(e) => setRandomize(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <Shuffle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t('quiz.setup.randomize')}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('quiz.setup.randomizeDesc')}</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Fixed Footer with Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('quiz.setup.backToSource')}</span>
            </button>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              <span>
                {mode === 'study' ? t('quiz.setup.startStudy') : t('quiz.setup.startExam')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};