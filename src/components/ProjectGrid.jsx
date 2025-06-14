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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Study Projects</h1>
          <p className="text-gray-600 mt-1">Manage your learning materials and track progress</p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project._id}
            onClick={() => {
              setSelectedProject(project);
              setCurrentView('project-overview');
            }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 ${project.color || 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{project.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="relative project-dropdown">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProjectDropdownId(showProjectDropdownId === project._id ? null : project._id);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showProjectDropdownId === project._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-100 transform origin-top-right transition-all duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToEdit(project);
                          setShowEditProjectModal(true);
                          setShowProjectDropdownId(null);
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
                        className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">{project.description}</p>
              
              {/* Progress Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Study Plan</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Brain className="w-4 h-4" />
                    <span>Flashcards</span>
                  </div>
                </div>
                <div className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                  View Details →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid; 