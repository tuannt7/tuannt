import React from 'react';
import { Code2, Database, Server, Cloud, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SkillsPage: React.FC = () => {
  const { t } = useLanguage();

  const skillCategories = [
    {
      title: t('skills.backend.title'),
      icon: Server,
      color: 'from-blue-500 to-blue-600',
      skills: [
        { name: 'Java', level: 90, years: '5+ years' },
        { name: 'Spring Boot', level: 88, years: '4+ years' },
        { name: 'Spring Framework', level: 85, years: '4+ years' },
        { name: 'REST APIs', level: 90, years: '5+ years' },
        { name: 'Microservices', level: 75, years: '2+ years' },
        { name: 'GraphQL', level: 70, years: '1+ years' },
      ],
    },
    {
      title: t('skills.database.title'),
      icon: Database,
      color: 'from-green-500 to-green-600',
      skills: [
        { name: 'PostgreSQL', level: 85, years: '4+ years' },
        { name: 'MySQL', level: 88, years: '5+ years' },
        { name: 'MongoDB', level: 75, years: '2+ years' },
        { name: 'Redis', level: 80, years: '3+ years' },
        { name: 'Oracle DB', level: 70, years: '2+ years' },
        { name: 'Elasticsearch', level: 65, years: '1+ years' },
      ],
    },
    {
      title: t('skills.devops.title'),
      icon: Cloud,
      color: 'from-purple-500 to-purple-600',
      skills: [
        { name: 'Docker', level: 82, years: '3+ years' },
        { name: 'Jenkins', level: 80, years: '3+ years' },
        { name: 'AWS', level: 75, years: '2+ years' },
        { name: 'Kubernetes', level: 70, years: '1+ years' },
        { name: 'GitLab CI/CD', level: 78, years: '2+ years' },
        { name: 'Linux', level: 85, years: '4+ years' },
      ],
    },
    {
      title: t('skills.tools.title'),
      icon: Code2,
      color: 'from-orange-500 to-orange-600',
      skills: [
        { name: 'IntelliJ IDEA', level: 95, years: '5+ years' },
        { name: 'Git', level: 90, years: '5+ years' },
        { name: 'Maven', level: 88, years: '4+ years' },
        { name: 'Gradle', level: 80, years: '3+ years' },
        { name: 'Postman', level: 85, years: '4+ years' },
        { name: 'SonarQube', level: 75, years: '2+ years' },
      ],
    },
    {
      title: t('skills.monitoring.title'),
      icon: Shield,
      color: 'from-red-500 to-red-600',
      skills: [
        { name: 'Prometheus', level: 75, years: '2+ years' },
        { name: 'Grafana', level: 75, years: '2+ years' },
        { name: 'ELK Stack', level: 70, years: '2+ years' },
        { name: 'Jaeger', level: 65, years: '1+ years' },
        { name: 'New Relic', level: 70, years: '1+ years' },
        { name: 'Splunk', level: 60, years: '1+ years' },
      ],
    },
    {
      title: t('skills.frontend.title'),
      icon: Zap,
      color: 'from-cyan-500 to-cyan-600',
      skills: [
        { name: 'JavaScript', level: 85, years: '4+ years' },
        { name: 'TypeScript', level: 80, years: '3+ years' },
        { name: 'React', level: 78, years: '2+ years' },
        { name: 'Vue.js', level: 75, years: '2+ years' },
        { name: 'HTML/CSS', level: 82, years: '5+ years' },
        { name: 'Tailwind CSS', level: 75, years: '1+ years' },
      ],
    },
  ];

  const certifications = [
    {
      name: t('skills.certifications.oracle'),
      issuer: 'Oracle',
      year: '2023',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      name: t('skills.certifications.spring'),
      issuer: 'VMware',
      year: '2022',
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('skills.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{skill.years}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t('skills.certifications.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t('skills.certifications.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-2xl mx-auto">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {cert.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">{cert.issuer}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{cert.year}</p>
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t('skills.summary.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">5+</div>
              <div className="text-gray-600 dark:text-gray-300">{t('skills.summary.experience')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-300">{t('skills.summary.projects')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-300">{t('skills.summary.technologies')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">2</div>
              <div className="text-gray-600 dark:text-gray-300">{t('skills.summary.certifications')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};