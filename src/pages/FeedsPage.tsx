import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, RefreshCw, Filter, Rss, Globe, Tag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Feed {
  title: string;
  link: string;
  image: string;
  description: string;
  publishedDate: number;
}

interface FeedsResponse {
  title: string;
  update: number;
  source: string;
  category: string;
  size: number;
  feeds: Feed[];
}

interface SourcesResponse {
  [source: string]: string[];
}

export const FeedsPage: React.FC = () => {
  const { t } = useLanguage();
  const [sources, setSources] = useState<SourcesResponse>({});
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [feedsData, setFeedsData] = useState<FeedsResponse | null>(null);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get configuration from environment variables
  const FEEDS_API_BASE_URL = import.meta.env.VITE_FEEDS_API_BASE_URL || 'https://tuannt.me/api/v1/article';
  const FEEDS_SOURCES_ENDPOINT = import.meta.env.VITE_FEEDS_SOURCES_ENDPOINT || '/sources';
  const FEEDS_ARTICLES_ENDPOINT = import.meta.env.VITE_FEEDS_ARTICLES_ENDPOINT || '';
  const FEEDS_DEFAULT_FALLBACK_IMAGE = import.meta.env.VITE_FEEDS_DEFAULT_FALLBACK_IMAGE || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';

  // Load sources on component mount
  useEffect(() => {
    loadSources();
  }, []);

  // Load feeds when source or category changes
  useEffect(() => {
    if (selectedSource && selectedCategory) {
      loadFeeds(selectedSource, selectedCategory);
    }
  }, [selectedSource, selectedCategory]);

  const loadSources = async () => {
    try {
      setIsLoadingSources(true);
      setError(null);
      
      const response = await fetch(`${FEEDS_API_BASE_URL}${FEEDS_SOURCES_ENDPOINT}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: SourcesResponse = await response.json();
      setSources(data);
      
      // Set default source and category
      const firstSource = Object.keys(data)[0];
      if (firstSource && data[firstSource].length > 0) {
        setSelectedSource(firstSource);
        setSelectedCategory(data[firstSource][0]);
      }
      
    } catch (error) {
      console.error('Error loading sources:', error);
      setError(error instanceof Error ? error.message : t('feeds.error.loadSources'));
    } finally {
      setIsLoadingSources(false);
    }
  };

  const loadFeeds = async (source: string, category: string) => {
    try {
      setIsLoadingFeeds(true);
      setError(null);
      
      const response = await fetch(`${FEEDS_API_BASE_URL}${FEEDS_ARTICLES_ENDPOINT}?source=${source}&category=${category}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FeedsResponse = await response.json();
      setFeedsData(data);
      
    } catch (error) {
      console.error('Error loading feeds:', error);
      setError(error instanceof Error ? error.message : t('feeds.error.loadFeeds'));
    } finally {
      setIsLoadingFeeds(false);
    }
  };

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    // Set first category of the new source
    if (sources[source] && sources[source].length > 0) {
      setSelectedCategory(sources[source][0]);
    }
  };

  const handleRefresh = () => {
    if (selectedSource && selectedCategory) {
      loadFeeds(selectedSource, selectedCategory);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return t('feeds.article.timeAgo.minutesAgo', { minutes });
    } else if (hours < 24) {
      return t('feeds.article.timeAgo.hoursAgo', { hours });
    } else {
      return t('feeds.article.timeAgo.daysAgo', { days });
    }
  };

  if (isLoadingSources) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{t('feeds.loading.sources')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters - No longer sticky */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('feeds.filters.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                {t('feeds.filters.source')}
              </label>
              <select
                value={selectedSource}
                onChange={(e) => handleSourceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {Object.keys(sources).map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                {t('feeds.filters.category')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={!selectedSource}
              >
                {selectedSource && sources[selectedSource]?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={handleRefresh}
                disabled={isLoadingFeeds || !selectedSource || !selectedCategory}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingFeeds ? 'animate-spin' : ''}`} />
                {t('feeds.filters.refresh')}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5">⚠️</div>
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">{t('feeds.error.title')}</h3>
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feeds Info */}
        {feedsData && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {feedsData.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{feedsData.source}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{feedsData.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Rss className="w-4 h-4" />
                    <span>{feedsData.size} {t('feeds.info.articles')}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('feeds.info.lastUpdate')}</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDate(feedsData.update)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingFeeds && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{t('feeds.loading.feeds')}</p>
            </div>
          </div>
        )}

        {/* Feeds Grid */}
        {feedsData && !isLoadingFeeds && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedsData.feeds.map((feed, index) => (
              <article
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feed.image}
                    alt={feed.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = FEEDS_DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                      {formatRelativeTime(feed.publishedDate)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feed.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {feed.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(feed.publishedDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatRelativeTime(feed.publishedDate)}
                    </div>
                  </div>

                  {/* Read More Button */}
                  <a
                    href={feed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                  >
                    {t('feeds.article.readMore')}
                    <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {feedsData && feedsData.feeds.length === 0 && !isLoadingFeeds && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rss className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('feeds.empty.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('feeds.empty.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
};