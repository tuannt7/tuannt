import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProgressBarProps {
  current: number;
  total: number;
  showNumbers?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showNumbers = false,
}) => {
  const { t } = useLanguage();
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className="space-y-2">
      {showNumbers && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{t('progress.question', { current: current + 1, total })}</span>
          <span>{t('progress.complete', { percentage })}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};