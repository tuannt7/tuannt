import React from 'react';
import { BookOpen } from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuizHeaderProps {
  title: string;
  onLogoClick?: () => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  title,
  onLogoClick,
}) => {
  const { t } = useLanguage();

  return (
    <header className="md:fixed md:top-0 md:left-0 md:right-0 bg-white shadow-sm border-b border-gray-100 md:z-50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Compact Clickable Logo */}
            <button
              onClick={onLogoClick}
              className={`p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md transition-all duration-200 ${
                onLogoClick 
                  ? 'hover:from-blue-600 hover:to-purple-700 hover:shadow-md cursor-pointer transform hover:scale-105' 
                  : 'cursor-default'
              }`}
              disabled={!onLogoClick}
              title={onLogoClick ? t('header.backToHome') : undefined}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </button>
            
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
              <p className="text-xs text-gray-500 leading-tight">{t('app.subtitle')}</p>
            </div>
          </div>
          
          {/* Compact right side with just language selector */}
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};