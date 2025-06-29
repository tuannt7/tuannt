import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimerDisplayProps {
  timeRemaining: number | null;
  isActive: boolean;
  mode: 'study' | 'exam';
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  isActive,
  mode,
}) => {
  const { t } = useLanguage();

  if (timeRemaining === null || !isActive) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 60) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800'; // Last minute
    if (timeRemaining <= 300) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/50 border-orange-200 dark:border-orange-800'; // Last 5 minutes
    return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800';
  };

  const getTimerIcon = () => {
    if (timeRemaining <= 60) return <AlertTriangle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${getTimerColor()}`}>
      {getTimerIcon()}
      <div className="font-mono font-bold text-sm">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};