import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-800';
      case 'success':
        return 'text-green-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in ${getBackgroundColor()} border rounded-lg shadow-lg p-4 max-w-md`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className={`flex-1 ${getTextColor()}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 