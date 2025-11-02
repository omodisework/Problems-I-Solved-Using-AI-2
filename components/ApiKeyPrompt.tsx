import React from 'react';
import Button from './Button';
import { BILLING_DOCS_URL } from '../constants';

// The AIStudio interface is now declared globally in types.ts
// so these local declarations are no longer needed.

interface ApiKeyPromptProps {
  onApiKeySelected: () => void;
  errorMessage: string;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySelected, errorMessage }) => {
  const handleSelectApiKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // Assume key selection was successful after triggering openSelectKey()
      onApiKeySelected();
    } else {
      alert("AI Studio API key selection not available in this environment.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">API Key Required</h2>
        <p className="text-red-400 mb-4">{errorMessage}</p>
        <p className="text-gray-300 mb-6">
          To use the AI functionalities, please select your Google Gemini API key.
          This helps cover the costs associated with AI model usage.
        </p>
        <Button onClick={handleSelectApiKey} className="w-full mb-4">
          Select API Key
        </Button>
        <p className="text-gray-400 text-sm">
          Learn more about billing for Gemini API:{' '}
          <a
            href={BILLING_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Billing Documentation
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;