import { MessageCircle, Minimize2, Send } from "lucide-react";
import { useState } from "react";

const RenderChatbot = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m your AI tutor. How can I help you with your studies today?' }
  ]);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { type: 'user', message: chatInput },
      { type: 'bot', message: 'Great question! Let me help you understand this concept better. Based on your study material, here\'s what I can explain...' }
    ]);
    setChatInput('');
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
};

export default RenderChatbot;