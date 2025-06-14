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
import ProjectModal from '../components/ProjectModal';
import FlashcardDisplay from '../components/FlashcardDisplay';
import ConfirmationModal from '../components/ConfirmationModal';
import RenderChatbot from '../components/RenderChatbots';
import AppHeader from '../components/AppHeader';
import ProjectHeader from '../components/ProjectHeader';
import ProjectNavigation from '../components/ProjectNavigation';
import ProjectGrid from '../components/ProjectGrid';
import ProjectContent from '../components/ProjectContent';
import Toast from '../components/Toast';

export default function StudyBuddyDashboard() {
  const { user, loading, logout } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [studyPlanId, setStudyPlanId] = useState(null);

  const [chatInput, setChatInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [projects, setProjects] = useState([]);

  // State for AI generated content
  const [studyPlanContent, setStudyPlanContent] = useState(null);
  const [flashcardsContent, setFlashcardsContent] = useState(null);
  const [qaContent, setQaContent] = useState(null);
  const [slidesContent, setSlidesContent] = useState(null);
  const [summaryContent, setSummaryContent] = useState(null);
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

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

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
      if (!selectedProject) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showToast('Please log in to access this feature', 'error');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch all content types in parallel
        const [studyPlanRes, flashcardsRes, qaRes, slidesRes, summaryRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/ai/projects/${selectedProject._id}/study-plan`, { headers }),
          fetch(`${BACKEND_URL}/api/ai/projects/${selectedProject._id}/flashcards`, { headers }),
          fetch(`${BACKEND_URL}/api/ai/projects/${selectedProject._id}/qa`, { headers }),
          fetch(`${BACKEND_URL}/api/ai/projects/${selectedProject._id}/slides`, { headers }),
          fetch(`${BACKEND_URL}/api/ai/summary/${selectedProject._id}`, { headers })
        ]);

        if (studyPlanRes.ok) {
          const data = await studyPlanRes.json();
          setStudyPlanContent({ content: data.content || [] });
          setStudyPlanId(data._id);
        }
        if (flashcardsRes.ok) {
          const data = await flashcardsRes.json();
          setFlashcardsContent(data);
        }
        if (qaRes.ok) {
          const data = await qaRes.json();
          setQaContent(data);
        }
        if (slidesRes.ok) {
          const data = await slidesRes.json();
          setSlidesContent(data);
        }
        if (summaryRes.ok) {
          const data = await summaryRes.json();
          setSummaryContent(data.data);
        }
      } catch (error) {
        console.error('Error fetching AI content:', error);
        showToast('Failed to fetch content', 'error');
      }
    };
    fetchAIContent();
  }, [selectedProject]);

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

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 5000);
  };

  const generateAIContent = async (contentType) => {
    if (!selectedProject) {
      showToast('Please select a project first', 'error');
      return;
    }

    if (!selectedProject.extractedTextContent) {
      showToast('Please upload study materials first', 'error');
      return;
    }

    // Clear previous content based on type
    switch (contentType) {
        case 'study-plan': 
          setStudyPlanContent(null); 
        break;
      case 'flashcards':
        setFlashcardsContent(null);
        break;
      case 'qa':
        setQaContent(null);
        break;
      case 'slides':
        setSlidesContent(null);
        break;
      case 'summary':
        setSummaryContent(null);
          break;
    }

    setAiLoading(true);
    setCurrentView(contentType);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const payload = {
        projectId: selectedProject._id,
        contentInput: selectedProject.extractedTextContent,
        projectName: selectedProject.title,
        projectDescription: selectedProject.description
      };

      let response;
      switch (contentType) {
        case 'study-plan':
          response = await axios.post(API_ROUTES.AI_GENERATE.STUDY_PLAN, payload, { headers });
          setStudyPlanContent(response.data.data);
          
          
          break;
        case 'flashcards':
          response = await axios.post(API_ROUTES.AI_GENERATE.FLASHCARDS, payload, { headers });
          setFlashcardsContent(response.data.data);
          break;
        case 'qa':
          response = await axios.post(API_ROUTES.AI_GENERATE.QA, payload, { headers });
          setQaContent(response.data.data);
          break;
        case 'slides':
          response = await axios.post(API_ROUTES.AI_GENERATE.SLIDES, payload, { headers });
          setSlidesContent(response.data.data);
          break;
        case 'summary':
          response = await axios.post(API_ROUTES.AI_GENERATE.SUMMARY, payload, { headers });
          setSummaryContent(response.data.data);
          break;
      }

      showToast(`${contentType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} generated successfully!`, 'success');
    } catch (error) {
      console.error('Error generating content:', error);
      showToast(error.response?.data?.message || 'Failed to generate content', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleStudyPlanItemToggle = async (itemIndex, currentStatus) => {
    console.log("Triggered");
    if (!selectedProject || !studyPlanContent || !studyPlanId){
      console.log(selectedProject)
      console.log(studyPlanContent)
      console.log(studyPlanId)
      return
    };

    const newStatus = currentStatus === 'completed' ? 'upcoming' : 'completed';

    try {
      const token = localStorage.getItem('token');
      
      // First update the study plan item status
      const res = await axios.put(
        API_ROUTES.AI_CONTENT.UPDATE_STUDY_PLAN_ITEM(studyPlanId, itemIndex),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Then update the project progress
      const progressRes = await axios.put(
        API_ROUTES.AI_CONTENT.UPDATE_PROJECT_PROGRESS(selectedProject._id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update both the study plan and project state
      // Make sure we're setting the content array, not the whole study plan object
      setStudyPlanContent(res.data.studyPlan.content || []);
      setSelectedProject(progressRes.data.project);
      
      // Update the projects list to reflect the new progress
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p._id === progressRes.data.project._id ? progressRes.data.project : p
        )
      );
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
              slidesContent={slidesContent}
              summaryContent={summaryContent}
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
        <ProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onSave={createNewProject}
          isEdit={false}
        />
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && projectToEdit && (
        <ProjectModal
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

      {/* Toast Component */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
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