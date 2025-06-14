import { MessageCircle, Minimize2, Send } from "lucide-react";
import { useState } from "react";
import axios from 'axios';
import { BACKEND_URL } from '../services/api';

const RenderChatbot = ({ projectId }) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m your AI tutor. How can I help you with your studies today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  function cleanContent(raw) {
    if (raw.startsWith('{"content":"') && raw.endsWith('"}')) {
      return raw.slice(12, -2); // remove first 12 characters and last 2 characters
    }
    if (raw.startsWith('{"response":') && raw.endsWith('}')) {
      return raw.slice(13, -2); // remove first 11 characters and last 1 character
    }
    return raw;
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setIsLoading(true);

    // Add user message to chat
    setChatMessages(prev => [
      ...prev,
      { type: 'user', message: userMessage }
    ]);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}/api/chat/${projectId}`, {
        message: userMessage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Add bot response to chat
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', message: cleanContent(response.data.data.response) }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', message: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
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
                disabled={isLoading}
              />
              <button 
                onClick={sendChatMessage}
                disabled={isLoading}
                className={`bg-blue-600 text-white p-2 rounded-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
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
};

export default RenderChatbot;