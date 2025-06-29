import React from 'react';
import { Calendar, MapPin, Award, Users, Coffee, Code2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const experiences = [
    {
      title: t('about.experience.senior.title'),
      company: t('about.experience.senior.company'),
      period: t('about.experience.senior.period'),
      description: t('about.experience.senior.desc'),
      technologies: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
    },
    {
      title: t('about.experience.mid.title'),
      company: t('about.experience.mid.company'),
      period: t('about.experience.mid.period'),
      description: t('about.experience.mid.desc'),
      technologies: ['Java', 'Spring Framework', 'MySQL', 'REST APIs', 'Maven', 'Git'],
    },
    {
      title: t('about.experience.junior.title'),
      company: t('about.experience.junior.company'),
      period: t('about.experience.junior.period'),
      description: t('about.experience.junior.desc'),
      technologies: ['Java', 'JSP', 'Servlet', 'Oracle DB', 'HTML/CSS', 'JavaScript'],
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: t('about.achievements.certification.title'),
      description: t('about.achievements.certification.desc'),
    },
    {
      icon: Users,
      title: t('about.achievements.team.title'),
      description: t('about.achievements.team.desc'),
    },
    {
      icon: Code2,
      title: t('about.achievements.projects.title'),
      description: t('about.achievements.projects.desc'),
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Bio */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.bio.title')}
            </h2>
            <div className="prose prose-lg text-gray-600 dark:text-gray-300">
              <p>{t('about.bio.paragraph1')}</p>
              <p>{t('about.bio.paragraph2')}</p>
              <p>{t('about.bio.paragraph3')}</p>
            </div>

            <div className="flex items-center space-x-6 pt-6">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <MapPin className="w-5 h-5" />
                <span>{t('profile.location')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>{t('profile.experience')}</span>
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.quickFacts.title')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Coffee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">{t('about.quickFacts.coffee')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-700 dark:text-gray-300">{t('about.quickFacts.languages')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">{t('about.quickFacts.teamSize')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-gray-700 dark:text-gray-300">{t('about.quickFacts.certifications')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            {t('about.experience.title')}
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            {t('about.achievements.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {achievement.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};