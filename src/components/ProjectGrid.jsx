import React from 'react';
import { BookOpen, MoreVertical, Edit, Trash2, Plus, Calendar, Brain, Target, Presentation } from 'lucide-react';

const ProjectGrid = ({ 
  projects, 
  setShowNewProjectModal, 
  setSelectedProject, 
  setCurrentView,
  setShowProjectDropdownId,
  showProjectDropdownId,
  setProjectToEdit,
  setShowEditProjectModal,
  openDeleteConfirmModal
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Study Projects</h1>
          <p className="text-gray-600 mt-1">Manage your learning materials and track progress</p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="p-6">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${project.color || 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-xl flex items-center justify-center shadow-sm`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="relative project-dropdown">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProjectDropdownId(showProjectDropdownId === project._id ? null : project._id);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showProjectDropdownId === project._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToEdit(project);
                          setShowEditProjectModal(true);
                          setShowProjectDropdownId(null);
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Project</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmModal(project);
                          setShowProjectDropdownId(null);
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 line-clamp-2">{project.description}</p>
              
              {/* Progress Section */}
              <div 
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentView('project-overview');
                }}
                className="cursor-pointer space-y-4"
              >
                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium text-gray-900">{project.progress?.overall || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (project.progress?.overall || 0) < 30 ? 'bg-red-500' :
                        (project.progress?.overall || 0) < 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${project.progress?.overall || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Progress */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Calendar, label: 'Study Plan', progress: project.progress?.studyPlan || 0 },
                    { icon: Brain, label: 'Flashcards', progress: project.progress?.flashcards || 0 },
                    { icon: Target, label: 'Q&A', progress: project.progress?.qa || 0 }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-1">
                        <item.icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="text-xs font-medium text-gray-900">{item.progress}%</div>
                      <div className="text-[10px] text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Status Badge */}
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid; 