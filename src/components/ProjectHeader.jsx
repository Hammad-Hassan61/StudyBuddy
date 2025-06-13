import React from 'react';
import { ArrowLeft, Edit, Settings, X } from 'lucide-react';

const ProjectHeader = ({
  project,
  onEdit,
  onBack
}) => {
  if (!project) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.title || 'Untitled Project'}</h1>
          <p className="text-gray-600 mt-1">{project.description || 'No description provided'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onEdit(project.title, project.description)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProjectHeader; 