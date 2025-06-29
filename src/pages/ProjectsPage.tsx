import React from 'react';
import { ExternalLink, Github, Calendar, Users, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ProjectsPage: React.FC = () => {
  const { t } = useLanguage();

  const projects = [
    {
      title: t('projects.ecommerce.title'),
      description: t('projects.ecommerce.desc'),
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Docker'],
      github: 'https://github.com/ngthotuan/ecommerce-system',
      demo: 'https://ecommerce-demo.tuannt.me',
      featured: true,
      status: t('projects.status.production'),
      team: '4 developers',
      duration: '6 months',
    },
    {
      title: t('projects.crm.title'),
      description: t('projects.crm.desc'),
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['Java', 'Spring Boot', 'MySQL', 'Vue.js', 'Chart.js'],
      github: 'https://github.com/ngthotuan/crm-system',
      demo: 'https://crm-demo.tuannt.me',
      featured: true,
      status: t('projects.status.production'),
      team: '3 developers',
      duration: '5 months',
    },
    {
      title: t('projects.api.title'),
      description: t('projects.api.desc'),
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'JWT', 'Swagger'],
      github: 'https://github.com/ngthotuan/rest-api-platform',
      demo: 'https://api-docs.tuannt.me',
      featured: false,
      status: t('projects.status.completed'),
      team: '2 developers',
      duration: '4 months',
    },
    {
      title: t('projects.quiz.title'),
      description: t('projects.quiz.desc'),
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      github: 'https://github.com/ngthotuan/quiz-application',
      demo: '/quiz',
      featured: false,
      status: t('projects.status.completed'),
      team: '1 developer',
      duration: '2 months',
    },
    {
      title: t('projects.dashboard.title'),
      description: t('projects.dashboard.desc'),
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['Java', 'Spring Boot', 'React', 'D3.js', 'WebSocket'],
      github: 'https://github.com/ngthotuan/admin-dashboard',
      demo: 'https://dashboard.tuannt.me',
      featured: false,
      status: t('projects.status.production'),
      team: '3 developers',
      duration: '4 months',
    },
    {
      title: t('projects.booking.title'),
      description: t('projects.booking.desc'),
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['Java', 'Spring Boot', 'React', 'Stripe', 'PostgreSQL'],
      github: 'https://github.com/ngthotuan/booking-system',
      demo: 'https://booking-demo.tuannt.me',
      featured: false,
      status: t('projects.status.development'),
      team: '2 developers',
      duration: '3 months',
    },
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  const getStatusColor = (status: string) => {
    if (status.includes('Production') || status.includes('Sản xuất')) return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
    if (status.includes('Development') || status.includes('Phát triển')) return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('projects.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-20">
          <div className="flex items-center mb-8">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('projects.featured')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {project.team}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {project.duration}
                    </div>
                  </div>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Links */}
                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      {t('projects.viewCode')}
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('projects.liveDemo')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t('projects.other')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProjects.map((project, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Links */}
                  <div className="flex space-x-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Github className="w-3 h-3 mr-1" />
                      {t('projects.code')}
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {t('projects.demo')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};