import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Brain, Zap, Upload, Users, Mic, FileText, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../services/api';
import { useUser } from '../UserContext';

const GOOGLE_AUTH_URL = `${BACKEND_URL}/api/auth/google`;

const StudyBuddyLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Listen for Google OAuth callback
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'google-auth-success') {
        setShowAuthModal(false);
        navigate('/dashboard');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // If still loading or user is logged in, show nothing
  if (loading || user) {
    return null;
  }

  const openGoogleAuth = () => {
    // Open Google OAuth in a new window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const authWindow = window.open(
      GOOGLE_AUTH_URL,
      'GoogleAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Poll for token in URL (for local dev, you may want to use postMessage from your frontend callback page)
    const timer = setInterval(() => {
      try {
        if (authWindow.closed) {
          clearInterval(timer);
        }
        // You can implement token passing via postMessage for more security
      } catch (e) {}
    }, 500);
  };

  const features = [
    { icon: FileText, title: "Smart Summaries", desc: "AI-powered content analysis" },
    { icon: Target, title: "Custom Study Plans", desc: "Tailored to your schedule" },
    { icon: Lightbulb, title: "Smart Flashcards", desc: "Interactive learning cards" },
    { icon: Brain, title: "Q&A Generation", desc: "Comprehensive test prep" }
  ];

  const FloatingElement = ({ children, delay = 0, className = "" }) => (
    <div className={`animate-bounce ${className}`} style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden px-5">
      {/* Modal Popup for Auth */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Welcome to Study Buddy</h2>
            <p className="mb-6 text-center text-gray-600">Continue with google</p>
            <button
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg mb-4"
              onClick={openGoogleAuth}
            >
             <FaGoogle className="w-5 h-5" /> Continue with google
            </button>
            <div className="text-center text-gray-400 text-xs">We never post to Google or share your data.</div>
          </div>
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-50 rounded-full opacity-40 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 p-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Study Buddy
            </span>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover:shadow-lg" onClick={() => setShowAuthModal(true)}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 w-full px-4 sm:px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`space-y-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-blue-600">
                  Smart Study
                </span>
                <br />
                <span className="text-gray-800">Assistant</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                Transform any PDF into personalized study materials with AI-powered summaries, custom plans, and interactive flashcards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2" onClick={() => setShowAuthModal(true)}>
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Sign up</span>
              </button>
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300" onClick={() => setShowAuthModal(true)}>
                Login
              </button>
            </div>
          </div>

          {/* Animated Visual */}
          <div className={`relative transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main Device */}
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
                <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-blue-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-blue-200 rounded-full w-3/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="h-4 bg-blue-200 rounded-full w-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl transition-all duration-500 border ${
                        activeFeature === index
                          ? 'bg-blue-600 text-white border-blue-600 scale-105'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <feature.icon className="w-6 h-6 mb-2" />
                      <div className="text-sm font-semibold">{feature.title}</div>
                      <div className={`text-xs ${activeFeature === index ? 'text-blue-100' : 'text-gray-500'}`}>
                        {feature.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <FloatingElement delay={0} className="absolute -top-6 -left-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </FloatingElement>

              <FloatingElement delay={1} className="absolute -top-4 -right-8">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </FloatingElement>

              <FloatingElement delay={2} className="absolute -bottom-6 -right-4">
                <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 w-full px-4 sm:px-6 py-20 bg-gray-50">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
            Everything You Need to Study Better
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your PDF, set your study time, and let AI create a personalized learning experience just for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: FileText, title: "Smart Summaries", desc: "AI analyzes your PDF and creates concise, comprehensive summaries that capture all key concepts." },
            { icon: Target, title: "Custom Study Plans", desc: "Personalized roadmaps based on your available time and learning objectives." },
            { icon: Lightbulb, title: "Interactive Flashcards", desc: "Automatically generated flashcards for quick revision and memory reinforcement." },
            { icon: Brain, title: "Q&A Generation", desc: "Comprehensive questions and answers to test your understanding and prepare for exams." },
            { icon: Mic, title: "Speech-to-Text", desc: "Convert lectures and voice notes into searchable text for better organization." },
            { icon: Users, title: "Collaborative Learning", desc: "Create study groups, share content, and connect with peers for enhanced learning." }
          ].map((feature, index) => (
            <div
              key={index}
              className={`group p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-500 hover:shadow-lg transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full px-0 py-20 bg-blue-50 border-b border-blue-100 transition-all duration-1000 transform
        ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}">
        <div className="text-center max-w-full p-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter, not harder.
          </p>
          <button className="group px-12 py-5 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg flex items-center space-x-3 mx-auto" onClick={() => setShowAuthModal(true)}>
            <span>Start Learning Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 w-full px-4 sm:px-6 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">Study Buddy</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2025 Study Buddy. Empowering students worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudyBuddyLanding;
