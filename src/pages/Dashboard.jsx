import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Target, 
  Brain, 
  Users, 
  Mic, 
  Upload, 
  Play, 
  CheckCircle,
  Calendar,
  Zap,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Plus,
  Star,
  ArrowRight,
  BarChart3,
  Map,
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  Presentation,
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  X,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { API_ROUTES, BACKEND_URL } from '../services/api';
import { useUser } from '../UserContext';
import NewProjectModal from '../components/NewProjectModal';
import ProjectModal from '../components/ProjectModal';
import FlashcardDisplay from '../components/FlashcardDisplay';
import ConfirmationModal from '../components/ConfirmationModal';

export default function StudyBuddyDashboard() {
  const { user, loading, logout } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m your AI tutor. How can I help you with your studies today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  // const [extractedText, setExtractedText] = useState(''); // Removed: No longer displayed to user

  const [projects, setProjects] = useState([]);

  // State for AI generated content
  const [studyPlanContent, setStudyPlanContent] = useState(null);
  const [flashcardsContent, setFlashcardsContent] = useState(null);
  const [qaContent, setQaContent] = useState(null);
  const [roadmapContent, setRoadmapContent] = useState(null);
  const [slidesContent, setSlidesContent] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // State for project editing modal
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // State for project card dropdown
  const [showProjectDropdownId, setShowProjectDropdownId] = useState(null);

  // State for PDF Viewer Modal
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrlToView, setPdfUrlToView] = useState('');

  // State for custom delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      fetchProjects();
    }
  }, [loading, user]);

  // Effect to fetch comprehensive project data when a project is selected
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (selectedProject?._id) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(API_ROUTES.PROJECTS.GET_SINGLE(selectedProject._id), {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Update selectedProject with the full data from backend
          setSelectedProject(res.data);
          // Initialize editing states
          setProjectToEdit(res.data);
        } catch (error) {
          console.error("Error fetching project detailsántica:", error);
        }
      }
    };
    fetchProjectDetails();
  }, [selectedProject?._id]);

  // Effect to fetch AI content when project or view changes
  useEffect(() => {
    const fetchAIContent = async () => {
      if (!selectedProject || !selectedProject._id || !currentView) return;

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        setAiLoading(true);
        let response;
        switch (currentView) {
          case 'study-plan':
            if (!studyPlanContent) {
              response = await axios.get(API_ROUTES.AI_CONTENT.GET_STUDY_PLAN(selectedProject._id), { headers });
              setStudyPlanContent(response.data.content);
            }
            break;
          case 'flashcards':
            if (!flashcardsContent) {
              response = await axios.get(API_ROUTES.AI_CONTENT.GET_FLASHCARDS(selectedProject._id), { headers });
              setFlashcardsContent(response.data.content);
            }
            break;
          case 'qa':
            if (!qaContent) {
              response = await axios.get(API_ROUTES.AI_CONTENT.GET_QA(selectedProject._id), { headers });
              setQaContent(response.data.content);
            }
            break;
          case 'roadmap':
            if (!roadmapContent) {
              response = await axios.get(API_ROUTES.AI_CONTENT.GET_ROADMAP(selectedProject._id), { headers });
              setRoadmapContent(response.data.content);
            }
            break;
          case 'slides':
            if (!slidesContent) {
              response = await axios.get(API_ROUTES.AI_CONTENT.GET_SLIDES(selectedProject._id), { headers });
              setSlidesContent(response.data.content);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching AI content for ${currentView}:`, error);
        // Handle error: e.g., clear content, show message
      } finally {
        setAiLoading(false);
      }
    };
    fetchAIContent();
  }, [selectedProject, currentView]); // Depend on selectedProject and currentView

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ROUTES.PROJECTS.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Handle error, e.g., redirect to login if unauthorized
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && selectedProject && file.type === 'application/pdf') {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('pdfFile', file);

      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(API_ROUTES.PROJECTS.UPLOAD_PDF(selectedProject._id), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
        console.log("Upload successful:", res.data);
        // setExtractedText(res.data.extractedTextContent); // Removed: No longer displayed to user

        // Update the selected project's files immediately for display
        setSelectedProject(prev => ({
            ...prev,
            uploadedFiles: [...(prev.uploadedFiles || []), { fileName: res.data.fileName, filePath: res.data.filePath }],
            extractedTextContent: res.data.extractedTextContent // Ensure this is consistently updated
        }));
        
        setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 500); // Small delay to show 100% progress
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsUploading(false);
        setUploadProgress(0);
        // Handle error, e.g., show a message to the user
      }
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { type: 'user', message: chatInput },
      { type: 'bot', message: 'Great question! Let me help you understand this concept better. Based on your study material, here\'s what I can explain...' }
    ]);
    setChatInput('');
  };

  const createNewProject = async (title, description) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(API_ROUTES.PROJECTS.CREATE, {
        title,
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newProject = res.data;
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setCurrentView('project-overview');
      setShowNewProjectModal(false); // Close modal on successful creation
    } catch (error) {
      console.error("Error creating new project:", error);
      // Handle error, e.g., show a message to the user
    }
  };

  const generateAIContent = async (contentType) => {
    if (!selectedProject || !selectedProject.extractedTextContent) {
      alert("Please select a project and upload materials first.");
      return;
    }
    setAiLoading(true);
    // Clear previous content state for the current type before generating new one
    switch (contentType) {
        case 'study-plan': setStudyPlanContent(null); break;
        case 'flashcards': setFlashcardsContent(null); break;
        case 'qa': setQaContent(null); break;
        case 'roadmap': setRoadmapContent(null); break;
        case 'slides': setSlidesContent(null); break;
        default: break;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        projectId: selectedProject._id,
        contentInput: selectedProject.extractedTextContent,
        projectName: selectedProject.title, // Pass project name for context
      };

      let response;
      switch (contentType) {
        case 'study-plan':
          response = await axios.post(API_ROUTES.AI_GENERATE.STUDY_PLAN, payload, { headers: { Authorization: `Bearer ${token}` } });
          setStudyPlanContent(response.data.data.content);
          break;
        case 'flashcards':
          response = await axios.post(API_ROUTES.AI_GENERATE.FLASHCARDS, payload, { headers: { Authorization: `Bearer ${token}` } });
          setFlashcardsContent(response.data.data.content);
          break;
        case 'qa':
          response = await axios.post(API_ROUTES.AI_GENERATE.QA, payload, { headers: { Authorization: `Bearer ${token}` } });
          setQaContent(response.data.data.content);
          break;
        case 'roadmap':
          response = await axios.post(API_ROUTES.AI_GENERATE.ROADMAP, payload, { headers: { Authorization: `Bearer ${token}` } });
          setRoadmapContent(response.data.data.content);
          break;
        case 'slides':
          response = await axios.post(API_ROUTES.AI_GENERATE.SLIDES, payload, { headers: { Authorization: `Bearer ${token}` } });
          setSlidesContent(response.data.data.content);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error generating ${contentType}:`, error);
      // Handle error, show message to user
    } finally {
      setAiLoading(false);
    }
  };

  const handleStudyPlanItemToggle = async (itemIndex, currentStatus) => {
    if (!selectedProject || !studyPlanContent || !studyPlanContent._id) return;

    const newStatus = currentStatus === 'completed' ? 'upcoming' : 'completed';

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        API_ROUTES.AI_CONTENT.UPDATE_STUDY_PLAN_ITEM(studyPlanContent._id, itemIndex),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the frontend state to reflect the change
      setStudyPlanContent(res.data.studyPlan); // Backend sends back updated studyPlan
    } catch (error) {
      console.error("Error updating study plan item status:", error);
      // Handle error
    }
  };

  const handleUpdateProject = async (title, description) => {
    if (!projectToEdit || !title.trim()) {
      alert("Project title cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(API_ROUTES.PROJECTS.GET_SINGLE(projectToEdit._id), 
        {
          title,
          description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update selected project with the new data
      setSelectedProject(res.data);
      // Update projects list to reflect the change
      setProjects(prevProjects => 
        prevProjects.map(p => (p._id === res.data._id ? res.data : p))
      );
      setShowEditProjectModal(false); // Close modal on successful update
      setProjectToEdit(null); // Clear project to edit
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project.");
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return; // Ensure a project is selected for deletion

    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ROUTES.PROJECTS.GET_SINGLE(projectToDelete._id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      if (selectedProject?._id === projectToDelete._id) {
        setSelectedProject(null);
        setCurrentView('dashboard');
      }
      setShowDeleteConfirm(false); // Close the modal
      setProjectToDelete(null); // Clear the project to delete
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
      setShowDeleteConfirm(false); // Close the modal even on error
      setProjectToDelete(null); // Clear the project to delete
    }
  };

  // Function to open delete confirmation modal
  const openDeleteConfirmModal = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
    setShowProjectDropdownId(null); // Close the project dropdown
  };

  // Add click outside handler for project dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if click is outside of any project dropdown
      if (showProjectDropdownId && !event.target.closest('.project-dropdown')) {
        setShowProjectDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProjectDropdownId]);

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

  const renderProjectsGrid = () => (
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${project.color || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="relative project-dropdown">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProjectDropdownId(showProjectDropdownId === project._id ? null : project._id);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showProjectDropdownId === project._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToEdit(project);
                          setShowEditProjectModal(true);
                          setShowProjectDropdownId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit Project
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmModal(project);
                          setShowProjectDropdownId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div 
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentView('project-overview');
                }}
                className="cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Files</p>
                      <p className="font-semibold text-gray-900">{project.uploadedFiles?.length || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Study Time</p>
                      <p className="font-semibold text-gray-900">{project.studyTime || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs text-gray-500">Last accessed: {project.lastAccessed || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectView = () => {
    if (!selectedProject) return null;

    const renderProjectContent = () => {
      switch (currentView) {
        case 'project-overview':
          return (
            <div className="space-y-6">
              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[{
                  label: 'Study Time',
                  value: selectedProject.studyTime || 'N/A',
                  icon: Clock,
                  color: 'text-blue-500'
                },
                {
                  label: 'Files Uploaded',
                  value: selectedProject.uploadedFiles?.length || 0,
                  icon: FileText,
                  color: 'text-green-500'
                },
                {
                  label: 'Flashcards',
                  value: selectedProject.flashcardsCount || 0,
                  icon: Brain,
                  color: 'text-purple-500'
                },
                {
                  label: 'Q&A Pairs',
                  value: selectedProject.qaPairsCount || 0,
                  icon: Target,
                  color: 'text-orange-500'
                }].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {projectTabs.slice(1).map((tab) => (
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

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { action: 'Created 5 new flashcards', time: '2 hours ago', icon: Brain },
                    { action: 'Completed Q&A session', time: '1 day ago', icon: Target },
                    { action: 'Uploaded new PDF material', time: '2 days ago', icon: Upload }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <activity.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'upload':
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Study Materials</h2>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                >
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Uploading...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">Upload your study materials</p>
                        <p className="text-sm text-gray-500 mt-1">PDF, DOC, PPT files supported • Max 50MB</p>
                      </div>
                      <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Choose Files
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {selectedProject?.uploadedFiles?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProject.uploadedFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setPdfUrlToView(`${BACKEND_URL}/uploads/${encodeURIComponent(file.filePath)}`); // Use encodeURIComponent
                            setShowPdfViewer(true);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-blue-500" />
                            <span className="font-medium text-gray-800 break-all">{file.fileName}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'study-plan':
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI-Generated Study Plan</h2>
                {!studyPlanContent && !aiLoading && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Generate a personalized study plan based on your uploaded materials.</p>
                    <button 
                      onClick={() => generateAIContent('study-plan')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Generate Study Plan
                    </button>
                  </div>
                )}
                {aiLoading && currentView === 'study-plan' && (
                  <div className="text-center py-8">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-blue-600">Generating study plan, please wait...</p>
                  </div>
                )}
                {studyPlanContent && studyPlanContent.content && (
                  <div className="space-y-4">
                    {studyPlanContent.content.map((phase, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border-l-4 flex items-center justify-between transition-colors duration-200
                          ${phase.status === 'completed' ? 'bg-green-50 border-green-500' :
                            phase.status === 'current' ? 'bg-blue-50 border-blue-500' :
                            'bg-gray-50 border-gray-300'
                          }`}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{phase.phase}</h3>
                          <p className="text-sm text-gray-600">Duration: {phase.duration}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {phase.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                          {phase.status === 'current' && <Play className="w-6 h-6 text-blue-500" />}
                          <input
                            type="checkbox"
                            checked={phase.status === 'completed'}
                            onChange={() => handleStudyPlanItemToggle(index, phase.status)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );

        case 'flashcards':
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
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
                <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
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
                <Presentation className="w-16 h-16 text-purple-500 mx-auto mb-4" />
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
                <Map className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
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

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setCurrentView('dashboard');
                setSelectedProject(null);
                setShowEditProjectModal(false); // Exit editing mode when leaving project view
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              {showEditProjectModal ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={projectToEdit?.title}
                    onChange={(e) => setProjectToEdit(prev => ({ ...prev, title: e.target.value }))}
                    className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                  />
                  <textarea
                    value={projectToEdit?.description}
                    onChange={(e) => setProjectToEdit(prev => ({ ...prev, description: e.target.value }))}
                    rows="2"
                    className="text-gray-600 mt-1 w-full border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent resize-none"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">{selectedProject.title}</h1>
                  <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {showEditProjectModal ? (
              <>
                <button 
                  onClick={() => {
                    setShowEditProjectModal(false);
                    setProjectToEdit(null); // Reset to original
                  }}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowEditProjectModal(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex space-x-1 overflow-x-auto">
              {projectTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id === 'overview' ? 'project-overview' : tab.id)}
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

        {/* Project Content */}
        {renderProjectContent()}
      </div>
    );
  };

  const renderChatbot = () => (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      chatbotOpen ? 'w-96 h-96' : 'w-16 h-16'
    }`}>
      {chatbotOpen ? (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Tutor</h3>
                <p className="text-xs text-gray-500">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setChatbotOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-sm ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask your AI tutor..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button 
                onClick={sendChatMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setChatbotOpen(true)}
          className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Study Buddy</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <div className="flex items-center space-x-2 cursor-pointer group">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user && user.picture ? (
                    <img src={user.picture} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user && user.name ? user.name.charAt(0).toUpperCase() : 'S'
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {currentView === 'dashboard' ? renderProjectsGrid() : renderProjectView()}
      </main>

      {/* AI Tutor Chatbot - Only show when in project view */}
      {selectedProject && renderChatbot()}

      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onCreateProject={createNewProject}
        />
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && projectToEdit && (
        <ProjectModal
          isOpen={showEditProjectModal}
          onClose={() => setShowEditProjectModal(false)}
          onSave={handleUpdateProject}
          initialTitle={projectToEdit.title}
          initialDescription={projectToEdit.description}
          isEdit={true}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProject}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the project "${projectToDelete?.title}"? This action cannot be undone and will delete all associated AI content.`}
      />

      {/* PDF Viewer Modal */}
      {showPdfViewer && pdfUrlToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-4xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold z-10"
              onClick={() => setShowPdfViewer(false)}
              aria-label="Close PDF Viewer"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src={pdfUrlToView}
              width="100%"
              height="100%"
              className="rounded-lg"
              title="PDF Viewer"
            ></iframe>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}