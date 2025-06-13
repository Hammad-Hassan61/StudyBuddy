import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import RenderChatbot from '../components/RenderChatbots';
import AppHeader from '../components/AppHeader';
import ProjectHeader from '../components/ProjectHeader';
import ProjectNavigation from '../components/ProjectNavigation';
import ProjectGrid from '../components/ProjectGrid';
import ProjectContent from '../components/ProjectContent';

export default function StudyBuddyDashboard() {
  const { user, loading, logout } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);

  const [chatInput, setChatInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

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

  const [activeTab, setActiveTab] = useState('overview');

  const navigate = useNavigate();

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
          console.error("Error fetching project details:", error);
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

 
  //   if (!chatInput.trim()) return;
    
  //   setChatMessages(prev => [
  //     ...prev,
  //     { type: 'user', message: chatInput },
  //     { type: 'bot', message: 'Great question! Let me help you understand this concept better. Based on your study material, here\'s what I can explain...' }
  //   ]);
  //   setChatInput('');
  // };

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
      if (showProjectDropdownId && !event.target.closest('.project-dropdown')) {
        setShowProjectDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProjectDropdownId]);

          return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader user={user} logout={logout} />
      <main className="container mx-auto px-6 py-8">
        {selectedProject ? (
      <div className="space-y-6 animate-fade-in">
            <ProjectHeader 
              project={selectedProject}
              onEdit={handleUpdateProject}
              onBack={() => {
                setSelectedProject(null);
                setCurrentView('dashboard');
              }}
            />
            <ProjectNavigation 
              currentView={currentView}
              onTabChange={setCurrentView}
            />
            <ProjectContent 
              currentView={currentView}
              selectedProject={selectedProject}
              studyPlanContent={studyPlanContent}
              flashcardsContent={flashcardsContent}
              qaContent={qaContent}
              roadmapContent={roadmapContent}
              slidesContent={slidesContent}
              aiLoading={aiLoading}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              generateAIContent={generateAIContent}
              handleStudyPlanItemToggle={handleStudyPlanItemToggle}
              setPdfUrlToView={setPdfUrlToView}
              setShowPdfViewer={setShowPdfViewer}
              BACKEND_URL={BACKEND_URL}
            />
        </div>
      ) : (
          <ProjectGrid 
            projects={projects}
            setShowNewProjectModal={setShowNewProjectModal}
            setSelectedProject={setSelectedProject}
            setCurrentView={setCurrentView}
            setShowProjectDropdownId={setShowProjectDropdownId}
            showProjectDropdownId={showProjectDropdownId}
            setProjectToEdit={setProjectToEdit}
            setShowEditProjectModal={setShowEditProjectModal}
            openDeleteConfirmModal={openDeleteConfirmModal}
          />
        )}
      </main>

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

      {/* AI Tutor Chatbot */}
      <RenderChatbot />

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