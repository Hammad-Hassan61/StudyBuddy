import React from 'react';
import { 
  BarChart3, 
  Upload, 
  Calendar, 
  Brain, 
  Target, 
  Presentation, 
  Map, 
  Mic 
} from 'lucide-react';

const projectTabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'upload', label: 'Materials', icon: Upload },
  { id: 'study-plan', label: 'Study Plan', icon: Calendar },
  { id: 'flashcards', label: 'Flashcards', icon: Brain },
  { id: 'qa', label: 'Q&A Review', icon: Target },
  { id: 'slides', label: 'Slides', icon: Presentation },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'speech', label: 'Speech-to-Text', icon: Mic }
];

const ProjectNavigation = ({ currentView, onTabChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex space-x-1 overflow-x-auto">
          {projectTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id === 'overview' ? 'project-overview' : tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                (currentView === tab.id || (tab.id === 'overview' && currentView === 'project-overview'))
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectNavigation; 