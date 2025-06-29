import React, { useState, useEffect } from 'react';
import { BookOpen, Link, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuizSource {
  name: string;
  url: string;
}

interface QuizSourceSelectorProps {
  onLoadQuestions: (sourceUrl: string, sourceName?: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const QuizSourceSelector: React.FC<QuizSourceSelectorProps> = ({
  onLoadQuestions,
  isLoading,
  error,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'predefined' | 'url' | 'json'>('predefined');
  const [customUrl, setCustomUrl] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [urlValidation, setUrlValidation] = useState<'valid' | 'invalid' | null>(null);
  const [jsonValidation, setJsonValidation] = useState<'valid' | 'invalid' | 'checking' | null>(null);
  
  // API state
  const [predefinedSources, setPredefinedSources] = useState<QuizSource[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get configuration from environment variables
  const API_URL = import.meta.env.VITE_QUIZ_API_URL || 'https://tuannt.me/static/quiz/all.json';
  const GRID_COLUMNS = parseInt(import.meta.env.VITE_QUIZ_GRID_COLUMNS || '4');
  const SOURCES_LIMIT = parseInt(import.meta.env.VITE_QUIZ_PREDEFINED_SOURCES_LIMIT || '4');

  // Fallback sources from environment variables
  const getFallbackSources = (): QuizSource[] => {
    const sources: QuizSource[] = [];
    
    for (let i = 1; i <= 4; i++) {
      const name = import.meta.env[`VITE_FALLBACK_QUIZ_${i}_NAME`];
      const url = import.meta.env[`VITE_FALLBACK_QUIZ_${i}_URL`];
      
      if (name && url) {
        sources.push({ name, url });
      }
    }
    
    return sources;
  };

  // Fetch predefined sources from API
  useEffect(() => {
    const fetchPredefinedSources = async () => {
      try {
        setApiLoading(true);
        setApiError(null);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(t('quiz.error.loadData') + `: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error(t('quiz.sourceSelector.apiError'));
        }

        // Transform API data to our simplified format - only keep name and url
        const sources: QuizSource[] = data.map((item: any) => ({
          name: item.name || item.title || 'Unnamed Quiz',
          url: item.url || item.link || '',
        })).filter(source => source.url); // Only keep sources with valid URLs

        setPredefinedSources(sources);
        console.log(`✅ Đã tải thành công ${sources.length} bộ quiz từ API`);
        
      } catch (error) {
        let errorMessage = t('quiz.sourceSelector.apiError');
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        console.error('❌ Lỗi tải danh sách quiz:', errorMessage);
        setApiError(errorMessage);
        
        // Fallback to environment-configured sources if API fails
        setPredefinedSources(getFallbackSources());
      } finally {
        setApiLoading(false);
      }
    };

    fetchPredefinedSources();
  }, [API_URL, t]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      const isValidFormat = url.startsWith('http://') || url.startsWith('https://');
      setUrlValidation(isValidFormat ? 'valid' : 'invalid');
    } catch {
      setUrlValidation('invalid');
    }
  };

  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setJsonValidation(null);
      return;
    }

    setJsonValidation('checking');
    
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setJsonValidation('valid');
      } else {
        setJsonValidation('invalid');
      }
    } catch {
      setJsonValidation('invalid');
    }
  };

  const handleUrlChange = (url: string) => {
    setCustomUrl(url);
    if (url) {
      validateUrl(url);
    } else {
      setUrlValidation(null);
    }
  };

  const handleJsonChange = (json: string) => {
    setJsonContent(json);
    validateJson(json);
  };

  const handleLoadFromUrl = () => {
    if (customUrl && urlValidation === 'valid') {
      onLoadQuestions(customUrl, 'Custom URL');
    }
  };

  const handleLoadFromJson = () => {
    if (jsonContent && jsonValidation === 'valid') {
      // Create a data URL for the JSON content
      const dataUrl = `data:application/json;base64,${btoa(jsonContent)}`;
      onLoadQuestions(dataUrl, 'Custom JSON');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('predefined')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'predefined'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">{t('quiz.sourceSelector.predefinedSources')}</span>
          <span className="sm:hidden">{t('common.predefined')}</span>
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'url'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Link className="w-4 h-4" />
          <span className="hidden sm:inline">{t('quiz.sourceSelector.inputUrl')}</span>
          <span className="sm:hidden">{t('common.url')}</span>
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'json'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">{t('quiz.sourceSelector.inputJson')}</span>
          <span className="sm:hidden">{t('common.json')}</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">{t('quiz.error.loadData')}</h3>
              <p className="text-red-700 dark:text-red-400 text-sm whitespace-pre-wrap">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Predefined Sources */}
        {activeTab === 'predefined' && (
          <div className="p-6">
            {/* API Error Display */}
            {apiError && (
              <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">{t('quiz.sourceSelector.apiError')}</h4>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">{apiError}</p>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">{t('quiz.sourceSelector.apiErrorDesc')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {apiLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto"></div>
                    <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{t('quiz.sourceSelector.loadingQuizzes')}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('quiz.sourceSelector.loadingWait')}</p>
                </div>
              </div>
            ) : (
              /* Quiz Grid - Configurable Layout with Center Alignment */
              <div className="flex justify-center">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${GRID_COLUMNS} gap-4 max-w-6xl`}>
                  {predefinedSources.slice(0, SOURCES_LIMIT).map((source, index) => (
                    <button
                      key={index}
                      onClick={() => onLoadQuestions(source.url, source.name)}
                      disabled={isLoading || !source.url}
                      className="group p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center min-w-[200px]"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Quiz Name */}
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {source.name}
                      </h3>
                      
                      {/* Loading State */}
                      {isLoading && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t('common.loading')}</span>
                        </div>
                      )}
                    </button>
                  ))}

                  {!apiLoading && predefinedSources.length === 0 && (
                    <div className="col-span-full text-center py-16">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('quiz.sourceSelector.noQuizzes')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{t('quiz.sourceSelector.noQuizzesDesc')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* URL Input */}
        {activeTab === 'url' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('quiz.sourceSelector.customInput')} - {t('quiz.sourceSelector.inputUrl')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('quiz.sourceSelector.customUrlDesc')}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('quiz.sourceSelector.urlLabel')}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder={t('quiz.sourceSelector.urlPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 dark:bg-gray-700 dark:text-white"
                  />
                  {urlValidation && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {urlValidation === 'valid' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {urlValidation === 'valid' && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {t('quiz.sourceSelector.validUrl')}
                  </p>
                )}
                {urlValidation === 'invalid' && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {t('quiz.sourceSelector.invalidUrl')}
                  </p>
                )}
              </div>

              <button
                onClick={handleLoadFromUrl}
                disabled={!customUrl || urlValidation !== 'valid' || isLoading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Link className="w-5 h-5" />
                )}
                <span>{t('quiz.sourceSelector.load')}</span>
              </button>
            </div>
          </div>
        )}

        {/* JSON Input */}
        {activeTab === 'json' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('quiz.sourceSelector.customInput')} - {t('quiz.sourceSelector.inputJson')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('quiz.sourceSelector.customJsonDesc')}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('quiz.sourceSelector.jsonLabel')}
                </label>
                <div className="relative">
                  <textarea
                    value={jsonContent}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder='[{"question": "What is Java?", "options": [{"text": "Programming language", "isCorrect": true}, {"text": "Coffee", "isCorrect": false}], "explanation": "Java is a programming language"}]'
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm dark:bg-gray-700 dark:text-white"
                  />
                  {jsonValidation && (
                    <div className="absolute right-3 top-3">
                      {jsonValidation === 'checking' ? (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      ) : jsonValidation === 'valid' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {jsonValidation === 'checking' && (
                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-1 flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('quiz.sourceSelector.checkingJson')}
                  </p>
                )}
                {jsonValidation === 'valid' && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {t('quiz.sourceSelector.validJson')}
                  </p>
                )}
                {jsonValidation === 'invalid' && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {t('quiz.sourceSelector.jsonInvalid')}
                  </p>
                )}
              </div>

              <button
                onClick={handleLoadFromJson}
                disabled={!jsonContent || jsonValidation !== 'valid' || isLoading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                <span>{t('quiz.sourceSelector.loadFromJson')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Format Information */}
      <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {t('quiz.sourceSelector.formatInfo')}
        </h3>
        <p className="text-blue-800 dark:text-blue-300 mb-4">
          {activeTab === 'url' 
            ? t('quiz.sourceSelector.formatDescUrl')
            : t('quiz.sourceSelector.formatDescJson')
          }
        </p>
        
        <div className="bg-blue-100 dark:bg-blue-800/50 rounded-lg p-4 font-mono text-sm text-blue-900 dark:text-blue-200 overflow-x-auto">
          <pre>{`[
  {
    "question": "What is Java?",
    "options": [
      {"text": "A programming language", "isCorrect": true},
      {"text": "A type of coffee", "isCorrect": false},
      {"text": "An island", "isCorrect": false}
    ],
    "explanation": "Java is a popular programming language."
  }
]`}</pre>
        </div>

        <div className="mt-4 space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <p><strong>{t('quiz.sourceSelector.requirements')}</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>{t('quiz.sourceSelector.reqQuestion')} <code className="bg-blue-200 dark:bg-blue-700 px-1 rounded">question</code></li>
            <li>{t('quiz.sourceSelector.reqOptions')}</li>
            <li>{t('quiz.sourceSelector.reqOptionFields')} <code className="bg-blue-200 dark:bg-blue-700 px-1 rounded">text</code> và <code className="bg-blue-200 dark:bg-blue-700 px-1 rounded">isCorrect</code></li>
            <li>{t('quiz.sourceSelector.reqOneCorrect')}</li>
            <li>{t('quiz.sourceSelector.reqExplanation')} <code className="bg-blue-200 dark:bg-blue-700 px-1 rounded">explanation</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};