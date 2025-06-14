export const BACKEND_URL = "http://localhost:5000";

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${BACKEND_URL}/api/auth/google`,
        ME: `${BACKEND_URL}/api/auth/me`,
    },
    PROJECTS: {
        CREATE: `${BACKEND_URL}/api/ai/projects`,
        GET_ALL: `${BACKEND_URL}/api/ai/projects`,
        GET_SINGLE: (projectId) => `${BACKEND_URL}/api/ai/projects/${projectId}`,
        UPLOAD_PDF: (projectId) => `${BACKEND_URL}/api/ai/upload/${projectId}`,
    },
    AI_GENERATE: {
        STUDY_PLAN: `${BACKEND_URL}/api/ai/generate/study-plan`,
        FLASHCARDS: `${BACKEND_URL}/api/ai/generate/flashcards`,
        QA: `${BACKEND_URL}/api/ai/generate/qa`,
        ROADMAP: `${BACKEND_URL}/api/ai/generate/roadmap`,
        SLIDES: `${BACKEND_URL}/api/ai/generate/slides`,
        SUMMARY: `${BACKEND_URL}/api/ai/generate/summary`,
    },
    AI_CONTENT: {
        GET_STUDY_PLAN: (projectId) => `${BACKEND_URL}/api/ai/projects/${projectId}/study-plan`,
        GET_FLASHCARDS: (projectId) => `${BACKEND_URL}/api/ai/projects/${projectId}/flashcards`,
        GET_QA: (projectId) => `${BACKEND_URL}/api/ai/projects/${projectId}/qa`,
        GET_ROADMAP: (projectId) => `${BACKEND_URL}/api/ai/projects/${projectId}/roadmap`,
        GET_SLIDES: (projectId) => `${BACKEND_URL}/api/ai/projects/${projectId}/slides`,
        UPDATE_STUDY_PLAN_ITEM: (studyPlanId, itemIndex) => `${BACKEND_URL}/api/ai/study-plans/${studyPlanId}/items/${itemIndex}/status`,
        UPDATE_PROJECT_PROGRESS: (projectId) => `${BACKEND_URL}/api/ai/projects/${projectId}/progress`,
    }
}
