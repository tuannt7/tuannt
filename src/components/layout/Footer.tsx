import React from 'react';
import { Github, Linkedin, Mail, MapPin, Code2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const socialLinks = [
    {
      name: 'GitHub',
      href: t('profile.github'),
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: t('profile.linkedin'),
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: `mailto:${t('profile.email')}`,
      icon: Mail,
    },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('profile.name')}</h3>
                <p className="text-gray-400 text-sm">{t('profile.subtitle')}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('profile.description')}
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{t('profile.location')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">{t('nav.about')}</a></li>
              <li><a href="/projects" className="text-gray-300 hover:text-white transition-colors">{t('nav.projects')}</a></li>
              <li><a href="/skills" className="text-gray-300 hover:text-white transition-colors">{t('nav.skills')}</a></li>
              <li><a href="/feeds" className="text-gray-300 hover:text-white transition-colors">Feeds</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.connect')}</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 dark:bg-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                    title={link.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t('profile.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};