import React from 'react';
import { 
  Clock, 
  FileText, 
  Target, 
  Brain, 
  Upload, 
  Play, 
  CheckCircle,
  Calendar,
  Zap,
  Presentation,
  Map,
  Mic
} from 'lucide-react';
import FlashcardDisplay from './FlashcardDisplay';

const ProjectContent = ({
  currentView,
  selectedProject,
  studyPlanContent,
  flashcardsContent,
  qaContent,
  roadmapContent,
  slidesContent,
  aiLoading,
  isUploading,
  uploadProgress,
  fileInputRef,
  handleFileUpload,
  generateAIContent,
  handleStudyPlanItemToggle,
  setPdfUrlToView,
  setShowPdfViewer,
  BACKEND_URL
}) => {
  if (!selectedProject) return null;

  
  switch (currentView) {
    case 'project-overview':
      return (
        <div className="space-y-6">
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Study Plan Progress',
                value: `${selectedProject.progress?.studyPlan || 0}%`,
                icon: Calendar,
                color: 'text-blue-500',
                progress: selectedProject.progress?.studyPlan || 0
              },
              {
                label: 'Flashcards Progress',
                value: `${selectedProject.progress?.flashcards || 0}%`,
                icon: Brain,
                color: 'text-purple-500',
                progress: selectedProject.progress?.flashcards || 0
              },
              {
                label: 'Q&A Progress',
                value: `${selectedProject.progress?.qa || 0}%`,
                icon: Target,
                color: 'text-orange-500',
                progress: selectedProject.progress?.qa || 0
              },
              {
                label: 'Slides Progress',
                value: `${selectedProject.progress?.slides || 0}%`,
                icon: Presentation,
                color: 'text-green-500',
                progress: selectedProject.progress?.slides || 0
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stat.progress < 30 ? 'bg-red-500' :
                      stat.progress < 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Overall Progress</h2>
                <p className="text-gray-600 mt-1">Track your learning journey</p>
              </div>
              <div className="relative">
                <svg className="w-24 h-24">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="48"
                    cy="48"
                  />
                  <circle
                    className={`${
                      selectedProject.progress?.overall < 30 ? 'text-red-500' :
                      selectedProject.progress?.overall < 70 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={`${(selectedProject.progress?.overall || 0) * 2.76} 276`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="48"
                    cy="48"
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                  {selectedProject.progress?.overall || 0}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Status</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProject.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                    selectedProject.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedProject.status === 'not_started' ? 'Not Started' :
                     selectedProject.status === 'in_progress' ? 'In Progress' :
                     'Completed'}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Last Activity</h3>
                <p className="text-gray-600">
                  {new Date(selectedProject.lastActivity).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'upload', label: 'Materials', icon: Upload },
                { id: 'study-plan', label: 'Study Plan', icon: Calendar },
                { id: 'flashcards', label: 'Flashcards', icon: Brain },
                { id: 'qa', label: 'Q&A Review', icon: Target },
                { id: 'slides', label: 'Slides', icon: Presentation },
                { id: 'roadmap', label: 'Roadmap', icon: Map },
                { id: 'speech', label: 'Speech-to-Text', icon: Mic }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <tab.icon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

      case 'upload':
        return (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-blue-50/30 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Upload Study Materials
                  </h2>
                </div>
      
                {/* Upload Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 cursor-pointer overflow-hidden ${
                    isUploading 
                      ? 'border-blue-400 bg-blue-50/50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-blue-400/5 to-blue-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {isUploading ? (
                    <div className="relative space-y-6">
                      {/* Animated Upload Icon */}
                      <div className="relative">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                          <Upload className="w-8 h-8 text-white animate-bounce" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-200 rounded-2xl animate-ping"></div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-lg font-semibold text-blue-600">Processing your files...</p>
                        <p className="text-sm text-gray-600">Please wait while we analyze your study materials</p>
                        
                        {/* Modern Progress Bar */}
                        <div className="max-w-xs mx-auto">
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Progress</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 transition-all duration-500 relative overflow-hidden"
                              style={{ width: `${uploadProgress}%` }}
                            >
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative space-y-6">
                      {/* Upload Icon with Animation */}
                      <div className="relative">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                          <Upload className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                      </div>
      
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                          Drop your PDF files here or click to browse
                        </h3>
                        <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                          PDF files only • Max 50MB per file
                        </p>
                      </div>
      
                      {/* PDF Format Badge */}
                      <div className="flex justify-center pt-4">
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-full shadow-lg opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                          📄 PDF Only
                        </div>
                      </div>
      
                      <button 
                        type="button" 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Choose Files
                      </button>
                    </div>
                  )}
                </div>
      
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
      
            {/* Uploaded Files Section */}
            {selectedProject?.uploadedFiles?.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Your Study Materials</h3>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedProject.uploadedFiles.length} file{selectedProject.uploadedFiles.length !== 1 ? 's' : ''}
                  </div>
                </div>
      
                {/* Files Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedProject.uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-blue-200"
                      onClick={() => {
                        setPdfUrlToView(`${BACKEND_URL}/uploads/${encodeURIComponent(file.filePath)}`);
                        setShowPdfViewer(true);
                      }}
                    >
                      {/* PDF Header */}
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      
                      <div className="p-6">
                        {/* PDF Icon */}
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="inline-block px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-md mb-2">
                              PDF
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                              {file.fileName}
                            </h4>
                          </div>
                        </div>
      
                        {/* File Info */}
                        <div className="space-y-2 text-xs text-gray-500">
                          <div className="flex items-center justify-between">
                            <span>Uploaded</span>
                            <span className="font-medium">{new Date(file.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Status</span>
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                              Ready
                            </span>
                          </div>
                        </div>
      
                        {/* View Button */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-center space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                            <span className="text-sm font-medium">Click to view</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'study-plan':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Study Plan</h2>
              <button
                onClick={() => generateAIContent('study-plan')}
                disabled={aiLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate Study Plan</span>
                  </>
                )}
              </button>
            </div>
  
            {studyPlanContent ? (
              <div className="relative">
                {/* Tree Structure Container */}
                <div className="relative flex flex-col items-center space-y-8">
                  {/* Vertical Line - Main Tree Trunk */}
                  <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 transform -translate-x-1/2 h-full"></div>
                  
                  {studyPlanContent.map((phase, index) => (
                    <div key={index} className="relative w-full max-w-6xl">
                      {/* Branch Line */}
                      <div className={`absolute top-1/2 transform -translate-y-1/2 w-16 h-0.5 ${
                        index % 2 === 0 ? 'left-1/2 bg-gradient-to-r' : 'right-1/2 bg-gradient-to-l'
                      } ${
                        phase.status === 'completed' ? 'from-green-400 to-green-200' :
                        phase.status === 'current' ? 'from-blue-400 to-blue-200' :
                        'from-gray-300 to-gray-200'
                      }`}></div>
  
                      {/* Tree Node */}
                      <div className={`flex ${index % 2 === 0 ? 'justify-start pl-20' : 'justify-end pr-20'} relative`}>
                        {/* Connection Node */}
                        <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-4 ${
                          index % 2 === 0 ? 'left-1/2 ml-12' : 'right-1/2 mr-12'
                        } ${
                          phase.status === 'completed' ? 'bg-green-400 border-green-200' :
                          phase.status === 'current' ? 'bg-blue-400 border-blue-200 animate-pulse' :
                          'bg-gray-300 border-gray-200'
                        } shadow-lg`}></div>
  
                        {/* Phase Card */}
                        <div className={`w-full max-w-md transform transition-all duration-500 hover:scale-105 ${
                          index % 2 === 0 ? 'hover:translate-x-2' : 'hover:-translate-x-2'
                        }`}>
                          <div className={`relative bg-white rounded-2xl shadow-xl border-2 overflow-hidden ${
                            phase.status === 'current' ? 'border-blue-400 shadow-blue-200' : 
                            phase.status === 'completed' ? 'border-green-400 shadow-green-200' : 
                            'border-gray-200 shadow-gray-200'
                          }`}>
                            {/* Status Indicator Bar */}
                            <div className={`h-2 w-full ${
                              phase.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                              phase.status === 'current' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                              'bg-gradient-to-r from-gray-300 to-gray-400'
                            }`}></div>
  
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                                    phase.status === 'current' ? 'bg-blue-100 text-blue-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {phase.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                     phase.status === 'current' ? <Play className="w-5 h-5" /> :
                                     <Clock className="w-5 h-5" />}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900">{phase.phase}</h3>
                                    <span className="text-sm text-gray-500">{phase.duration}</span>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  phase.status === 'current' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {phase.status === 'completed' ? 'Completed' :
                                   phase.status === 'current' ? 'In Progress' : 'Upcoming'}
                                </div>
                              </div>
  
                              {/* Content Sections */}
                              <div className="space-y-4">
                                {/* Objectives */}
                                {phase.objectives && phase.objectives.length > 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                      <Target className="w-4 h-4 mr-2" />
                                      Learning Objectives
                                    </h4>
                                    <div className="space-y-1">
                                      {phase.objectives.map((objective, idx) => (
                                        <div key={idx} className="text-sm text-blue-700 flex items-start">
                                          <span className="text-blue-400 mr-2 mt-1">•</span>
                                          <span>{objective}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
  
                                {/* Topics */}
                                {phase.topics && phase.topics.length > 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                      <Brain className="w-4 h-4 mr-2" />
                                      Topics
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {phase.topics.map((topic, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                          {topic}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
  
                                {/* Prerequisites */}
                                {phase.prerequisites && phase.prerequisites.length > 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                      <Clock className="w-4 h-4 mr-2" />
                                      Prerequisites
                                    </h4>
                                    <div className="space-y-1">
                                      {phase.prerequisites.map((prereq, idx) => (
                                        <div key={idx} className="text-sm text-blue-700 flex items-start">
                                          <span className="text-blue-400 mr-2 mt-1">•</span>
                                          <span>{prereq}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
  
                                {/* Resources */}
                                {phase.resources && phase.resources.length > 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                      <FileText className="w-4 h-4 mr-2" />
                                      Resources
                                    </h4>
                                    <div className="space-y-1">
                                      {phase.resources.map((resource, idx) => (
                                        <div key={idx} className="text-sm text-blue-700 flex items-start">
                                          <span className="text-blue-400 mr-2 mt-1">•</span>
                                          <span>{resource}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
  
                                {/* Practice Activities */}
                                {phase.practiceActivities && phase.practiceActivities.length > 0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                      <Play className="w-4 h-4 mr-2" />
                                      Practice Activities
                                    </h4>
                                    <div className="space-y-1">
                                      {phase.practiceActivities.map((activity, idx) => (
                                        <div key={idx} className="text-sm text-blue-700 flex items-start">
                                          <span className="text-blue-400 mr-2 mt-1">•</span>
                                          <span>{activity}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
  
                              {/* Action Button */}
                              <div className="mt-6 pt-4 border-t border-gray-100">
                                <button
                                  onClick={() => handleStudyPlanItemToggle(index, phase.status)}
                                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                    phase.status === 'completed' 
                                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-200' 
                                      : phase.status === 'current'
                                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-200'
                                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg shadow-gray-200'
                                  }`}
                                >
                                  {phase.status === 'completed' ? (
                                    <span className="flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Mark as Incomplete
                                    </span>
                                  ) : (
                                    <span className="flex items-center justify-center">
                                      <Target className="w-4 h-4 mr-2" />
                                      Mark as Complete
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl p-8 max-w-2xl mx-auto border border-blue-100 shadow-xl">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Learning Journey</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Generate a personalized study roadmap that adapts to your learning style and helps you track your progress through an interactive tree structure.
                  </p>
                  <button
                    onClick={() => generateAIContent('study-plan')}
                    disabled={aiLoading}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-200 disabled:opacity-50 font-semibold"
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Your Journey...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Generate Study Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    
        case 'flashcards':
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-16 h-16 text-blue-500 mx-auto" />
              {flashcardsContent && (
                <button 
                  onClick={() => generateAIContent('flashcards')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Interactive Flashcards</h2>
            {!flashcardsContent && !aiLoading && (
              <div className="py-4">
                <p className="text-gray-600 mb-6">Generate interactive flashcards from your uploaded materials.</p>
                <button 
                  onClick={() => generateAIContent('flashcards')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Generate Flashcards
                </button>
              </div>
            )}
            {aiLoading && currentView === 'flashcards' && (
              <div className="py-4">
                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-blue-600">Generating flashcards, please wait...</p>
              </div>
            )}
            {flashcardsContent && flashcardsContent.content && (
              <FlashcardDisplay cards={flashcardsContent.content} />
            )}
          </div>
        </div>
      );

    case 'qa':
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-16 h-16 text-green-500 mx-auto" />
              {qaContent && (
                <button 
                  onClick={() => generateAIContent('qa')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Q&A Review Session</h2>
            {!qaContent && !aiLoading && (
              <div className="py-4">
                <p className="text-gray-600 mb-6">Generate a series of questions and answers from your uploaded materials.</p>
                <button 
                  onClick={() => generateAIContent('qa')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Generate Q&A
                </button>
              </div>
            )}
            {aiLoading && currentView === 'qa' && (
              <div className="py-4">
                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-blue-600">Generating Q&A, please wait...</p>
              </div>
            )}
            {qaContent && qaContent.content && (
              <div className="mt-6 text-left space-y-6">
                {qaContent.content.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-2">Q: {item.question}</p>
                    <p className="text-gray-700">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'slides':
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex items-center justify-between mb-4">
              <Presentation className="w-16 h-16 text-purple-500 mx-auto" />
              {slidesContent && (
                <button 
                  onClick={() => generateAIContent('slides')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">AI-Generated Slides</h2>
            {!slidesContent && !aiLoading && (
              <div className="py-4">
                <p className="text-gray-600 mb-6">Generate presentation slides based on your uploaded materials.</p>
                <button 
                  onClick={() => generateAIContent('slides')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Generate Slides
                </button>
              </div>
            )}
            {aiLoading && currentView === 'slides' && (
              <div className="py-4">
                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-blue-600">Generating slides, please wait...</p>
              </div>
            )}
            {slidesContent && slidesContent.content && (
              <div className="mt-6 overflow-x-auto flex space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                {slidesContent.content.map((slideHtml, index) => (
                  <div 
                    key={index} 
                    className="flex-none w-96 h-64 bg-white rounded-lg shadow-md border border-gray-100 p-4 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: slideHtml }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'roadmap':
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex items-center justify-between mb-4">
              <Map className="w-16 h-16 text-indigo-500 mx-auto" />
              {roadmapContent && (
                <button 
                  onClick={() => generateAIContent('roadmap')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Learning Roadmap</h2>
            {!roadmapContent && !aiLoading && (
              <div className="py-4">
                <p className="text-gray-600 mb-6">Generate a personalized learning roadmap with key milestones.</p>
                <button 
                  onClick={() => generateAIContent('roadmap')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Generate Roadmap
                </button>
              </div>
            )}
            {aiLoading && currentView === 'roadmap' && (
              <div className="py-4">
                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-blue-600">Generating roadmap, please wait...</p>
              </div>
            )}
            {roadmapContent && roadmapContent.content && (
              <div className="mt-6 text-left space-y-6">
                {roadmapContent.content.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.milestone}</h3>
                    <p className="text-gray-700">{item.description}</p>
                    {item.eta && <p className="text-sm text-gray-500 mt-1">ETA: {item.eta}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'speech':
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Mic className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Speech-to-Text</h2>
            <p className="text-gray-600 mb-6">Convert your lectures and voice notes into searchable text</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Recording
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default ProjectContent; 