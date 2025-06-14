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
  Mic,
  MessageCircleQuestion
} from 'lucide-react';
import FlashcardDisplay from './FlashcardDisplay';

const ProjectContent = ({
  currentView,
  selectedProject,
  studyPlanContent,
  flashcardsContent,
  qaContent,
  slidesContent,
  summaryContent,
  loadingStates,
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
  const [currentSlide, setCurrentSlide] = React.useState(0);
  function cleanContent(raw) {
    if (raw.startsWith('{"content":"') && raw.endsWith('"}')) {
      return raw.slice(12, -2); // remove first 12 characters and last 2 characters
    }
    if (raw.startsWith('{"response":') && raw.endsWith('}')) {
      return raw.slice(13, -2); // remove first 11 characters and last 1 character
    }
    return raw;
  }

  if (!selectedProject) return null;

  
  switch (currentView) {
    case 'project-overview':
  return (
    <div className="space-y-6">
      {/* Welcome / Project Introduction */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Study Project</h2>
        <p className="text-gray-600">
          This is a high-level overview of this software. Here you'll find a summary of your learning goals,
          tools to explore, and a general timeline to help you stay on track.
        </p>
      </div>

      {/* Learning Goals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Goals</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Understand key concepts and definitions</li>
          <li>Review flashcards and quiz yourself</li>
          <li>Read supporting material and summaries</li>
          <li>Reflect on each module with brief notes</li>
        </ul>
      </div>

      {/* Recommended Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">Flashcards App</div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">Define Study Plan</div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">Generate summaries</div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">Q & A Review</div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">Slides</div>
          {/* <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">Task Planner</div> */}
        </div>
      </div>

      {/* Timeline Preview */}
      

      {/* Encouragement Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold text-blue-800">You're all set!</h3>
        <p className="text-blue-700 mt-2">
          Take it one step at a time and enjoy the learning journey.
        </p>
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
                disabled={loadingStates['study-plan']}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loadingStates['study-plan'] ? (
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
  
            {studyPlanContent && studyPlanContent.content && Array.isArray(studyPlanContent.content) ? (
              <div className="relative">
                {/* Tree Structure Container */}
                <div className="relative flex flex-col items-center space-y-8">
                  {/* Vertical Line - Main Tree Trunk */}
                  <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 transform -translate-x-1/2 h-full"></div>
                  
                  {studyPlanContent.content.map((phase, index) => (
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
                                      Completed
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
                    disabled={loadingStates['study-plan']}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-200 disabled:opacity-50 font-semibold"
                  >
                    {loadingStates['study-plan'] ? (
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
            <div className="space-y-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 rounded-3xl shadow-xl border border-blue-100/50 backdrop-blur-sm">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full -ml-12 -mb-12" />
                
                <div className="relative p-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 blur-lg" />
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl">
                          <Brain className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                          Interactive Flashcards
                        </h2>
                        <p className="text-slate-600 mt-1">Study with dynamic flip cards</p>
                      </div>
                    </div>
                    
              {flashcardsContent && (
                <button 
                  onClick={() => generateAIContent('flashcards')}
                        className="group relative bg-white border border-blue-200 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
                >
                        <Zap className="w-5 h-5 group-hover:text-blue-700 transition-colors" />
                        <span className="group-hover:text-blue-700 transition-colors">Regenerate</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                </button>
              )}
            </div>
        
                  {/* Empty State */}
            {!flashcardsContent && !loadingStates['flashcards'] && (
                    <div className="text-center py-12">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 blur-2xl" />
                        <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">Create Your Study Cards</h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Transform your uploaded materials into interactive flashcards for effective memorization and review.
                      </p>
                      
                <button 
                  onClick={() => generateAIContent('flashcards')}
                        className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform"
                      >
                        <span className="relative z-10 flex items-center space-x-2">
                          <Brain className="w-5 h-5" />
                          <span>Generate Flashcards</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            )}
        
                  {/* Loading State */}
            {loadingStates['flashcards'] && currentView === 'flashcards' && (
                    <div className="text-center py-16">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse" />
                        <div className="relative w-16 h-16 mx-auto">
                          <div className="absolute inset-0 border-4 border-blue-200 rounded-full opacity-30" />
                          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-blue-700 mb-2">Creating Your Cards</h3>
                      <p className="text-blue-600">Processing your materials and crafting interactive flashcards...</p>
                      
                      <div className="mt-6 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
              </div>
            )}
        
                  {/* Flashcards Content */}
                  {flashcardsContent && flashcardsContent.content && flashcardsContent.content.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800">
                            {flashcardsContent.content.length} Cards Ready
                          </h3>
                        </div>
                        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          Interactive Study Mode
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-6 border border-blue-100/50">
              <FlashcardDisplay cards={flashcardsContent.content} />
                      </div>
                    </div>
            )}
                </div>
          </div>
        </div>
      );
    case 'qa':
      return (
          <div className="space-y-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 rounded-3xl shadow-xl border border-blue-100/50 backdrop-blur-sm">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-full -ml-12 -mb-12" />
              
              <div className="relative p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 blur-lg" />
                      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl">
                        <Target className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                        Q&A Review Session
                      </h2>
                      <p className="text-slate-600 mt-1">Interactive question and answer practice</p>
                    </div>
                  </div>
                  
              {qaContent && (
                <button 
                  onClick={() => generateAIContent('qa')}
                      className="group relative bg-white border border-blue-200 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
                >
                      <Zap className="w-5 h-5 group-hover:text-blue-700 transition-colors" />
                      <span className="group-hover:text-blue-700 transition-colors">Regenerate</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                </button>
              )}
            </div>
      
                {/* Empty State */}
            {!qaContent && !loadingStates['qa'] && (
                  <div className="text-center py-12">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 blur-2xl" />
                      <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                        <MessageCircleQuestion className="w-12 h-12 text-blue-600" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">Ready to Test Your Knowledge?</h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                      Generate comprehensive questions and answers from your uploaded materials to reinforce your learning.
                    </p>
                    
                <button 
                  onClick={() => generateAIContent('qa')}
                      className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <Target className="w-5 h-5" />
                        <span>Generate Q&A Session</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            )}
      
                {/* Loading State */}
            {loadingStates['qa'] && currentView === 'qa' && (
                  <div className="text-center py-16">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse" />
                      <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full opacity-30" />
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Crafting Your Questions</h3>
                  <p className="text-blue-600">Analyzing your materials and generating thoughtful Q&A pairs...</p>
              </div>
            )}
      
                {/* Q&A Content */}
                {qaContent && qaContent.content && qaContent.content.length > 0 && (
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
        </div>
      );

    case 'slides':
      return (
            <div className="space-y-8">
              {/* Main Container with Enhanced Glassmorphism */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30 rounded-3xl shadow-2xl border border-blue-100/60 backdrop-blur-xl">
                {/* Enhanced Background Decorations */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-300/25 to-transparent rounded-full -mr-20 -mt-20 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-300/25 to-transparent rounded-full -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-200/15 to-cyan-200/15 rounded-full blur-xl animate-float" />
                
                <div className="relative p-10">
                  {/* Enhanced Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-5">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-5 rounded-3xl shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                          <Presentation className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                          Presentation Slides
                        </h2>
                        <p className="text-slate-600 text-lg font-medium">Comprehensive study materials</p>
                      </div>
                    </div>
                    
              {slidesContent && (
                <button 
                  onClick={() => generateAIContent('slides')}
                        className="group relative bg-white/90 backdrop-blur-sm border border-blue-200/60 text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50/80 hover:border-blue-300/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3"
                >
                        <Zap className="w-6 h-6 group-hover:text-blue-700 transition-colors group-hover:rotate-12" />
                        <span className="group-hover:text-blue-700 transition-colors text-lg">Regenerate</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </button>
              )}
            </div>
    
                  {/* Enhanced Empty State */}
            {!slidesContent && !loadingStates['slides'] && (
                    <div className="text-center py-16">
                      <div className="relative mb-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 blur-3xl animate-pulse" />
                        <div className="relative bg-gradient-to-br from-blue-100/80 to-cyan-100/80 backdrop-blur-sm p-10 rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-xl border border-blue-200/50">
                          <Presentation className="w-16 h-16 text-blue-600" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-800 mb-4">Create Your Study Slides</h3>
                      <p className="text-slate-600 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        Transform your study materials into beautiful, comprehensive presentation slides for enhanced learning.
                      </p>
                      
                <button 
                  onClick={() => generateAIContent('slides')}
                        className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-5 rounded-3xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform"
                      >
                        <span className="relative z-10 flex items-center space-x-3">
                          <Presentation className="w-6 h-6" />
                          <span>Generate Slides</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-white rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </button>
              </div>
            )}
    
                  {/* Enhanced Loading State */}
            {loadingStates['slides'] && currentView === 'slides' && (
                    <div className="text-center py-20">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-25 blur-2xl animate-pulse" />
                        <div className="relative w-20 h-20 mx-auto">
                          <div className="absolute inset-0 border-4 border-blue-200/40 rounded-full" />
                          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <div className="absolute inset-2 border-2 border-cyan-400 border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-blue-700 mb-3">Creating Your Slides</h3>
                      <p className="text-blue-600 text-lg">Processing materials and crafting beautiful slides...</p>
                      
                      <div className="mt-8 flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
              </div>
            )}
    
                  {/* Enhanced Slides Content */}
                  {slidesContent && slidesContent.content && slidesContent.content.length > 0 && (
                    <div className="space-y-8">
                      {/* Slides Header */}
                     
                      
                      {/* Presentation Style Slides */}
                      <div className="relative bg-gradient-to-br from-slate-50/80 to-blue-50/40 backdrop-blur-sm rounded-3xl p-8 border border-blue-100/60 shadow-inner">
                        {/* Main Slide Display */}
                        <div className="relative aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden">
                          {slidesContent.content.map((slide, index) => (
                  <div 
                    key={index} 
                              className={`absolute inset-0 transition-opacity duration-500 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                              }`}
                            >
                              <div className="h-full w-full p-8">
                                <div 
                                  className="prose prose-blue prose-lg max-w-none h-full prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-blue-700 prose-em:text-cyan-600 prose-img:my-0 prose-img:max-h-[calc(100%-2rem)] prose-img:object-contain"
                                  dangerouslySetInnerHTML={{ __html: slide.html }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Navigation Controls */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-blue-100/60 mb-4">
                          <button
                            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                            disabled={currentSlide === 0}
                            className="p-2 rounded-full hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            {slidesContent.content.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  index === currentSlide 
                                    ? 'bg-blue-600 w-4' 
                                    : 'bg-blue-200 hover:bg-blue-400'
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={() => setCurrentSlide(prev => Math.min(slidesContent.content.length - 1, prev + 1))}
                            disabled={currentSlide === slidesContent.content.length - 1}
                            className="p-2 rounded-full hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        {/* Slide Counter */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-blue-100/60">
                          <span className="text-blue-600 font-semibold">
                            {currentSlide + 1} / {slidesContent.content.length}
                          </span>
                        </div>
                      </div>
              </div>
            )}
                </div>
          </div>
        </div>
      );
    case 'summary':
      return (
        <div className="space-y-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30 rounded-3xl shadow-2xl border border-blue-100/60 backdrop-blur-xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-300/25 to-transparent rounded-full -mr-20 -mt-20 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-300/25 to-transparent rounded-full -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative p-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 blur-lg" />
                    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                      Document Summary
                    </h2>
                    <p className="text-slate-600 mt-1">Concise overview of your study materials</p>
                  </div>
                </div>
                
                {summaryContent && (
                <button 
                    onClick={() => generateAIContent('summary')}
                    className="group relative bg-white/90 backdrop-blur-sm border border-blue-200/60 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50/80 hover:border-blue-300/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
                >
                    <Zap className="w-5 h-5 group-hover:text-blue-700 transition-colors" />
                    <span className="group-hover:text-blue-700 transition-colors">Regenerate</span>
                </button>
              )}
            </div>

              {/* Empty State */}
              {!summaryContent && !loadingStates['summary'] && (
                <div className="text-center py-12">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-10 blur-2xl" />
                    <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                      <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">Create Document Summary</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Generate a comprehensive summary of your study materials to get a quick overview of the key concepts.
                  </p>
                  
                <button 
                    onClick={() => generateAIContent('summary')}
                    className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform"
                >
                    <span className="relative z-10 flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Generate Summary</span>
                    </span>
                </button>
              </div>
            )}

              {/* Loading State */}
              {loadingStates['summary'] && currentView === 'summary' && (
                <div className="text-center py-16">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse" />
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full opacity-30" />
                      <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Creating Summary</h3>
                  <p className="text-blue-600">Analyzing your materials and generating a comprehensive summary...</p>
              </div>
            )}

              {/* Summary Content */}
              {summaryContent && summaryContent.content && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-blue-100/60 p-8">
                    <div className="prose prose-blue max-w-none">
                      <style>
                        {`
                          .prose h1 {
                            color: #1e40af;
                            font-size: 2.25rem;
                            font-weight: 700;
                            margin-top: 2rem;
                            margin-bottom: 1rem;
                          }
                          .prose h2 {
                            color: #2563eb;
                            font-size: 1.875rem;
                            font-weight: 600;
                            margin-top: 1.75rem;
                            margin-bottom: 0.75rem;
                          }
                          .prose h3 {
                            color: #3b82f6;
                            font-size: 1.5rem;
                            font-weight: 600;
                            margin-top: 1.5rem;
                            margin-bottom: 0.5rem;
                          }
                          .prose p {
                            color: #1f2937;
                            font-size: 1.125rem;
                            line-height: 1.75;
                            margin-bottom: 1rem;
                          }
                          .prose ul {
                            list-style-type: disc;
                            margin-left: 1.5rem;
                            margin-bottom: 1rem;
                          }
                          .prose li {
                            color: #1f2937;
                            font-size: 1.125rem;
                            line-height: 1.75;
                            margin-bottom: 0.5rem;
                          }
                          .prose strong {
                            color: #1e40af;
                            font-weight: 600;
                          }
                          .prose em {
                            color: #3b82f6;
                            font-style: italic;
                          }
                          .prose .example {
                            background-color: #f0f9ff;
                            border-left: 4px solid #3b82f6;
                            padding: 1rem;
                            margin: 1rem 0;
                            border-radius: 0.5rem;
                          }
                          .prose .note {
                            background-color: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 1rem;
                            margin: 1rem 0;
                            border-radius: 0.5rem;
                          }
                        `}
                      </style>
                      <div dangerouslySetInnerHTML={{ __html: cleanContent(summaryContent.content) }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default ProjectContent; 