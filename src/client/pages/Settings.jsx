import React, { useState, useEffect } from 'react';

function Settings() {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const savedOpenAIKey = localStorage.getItem('openai_api_key') || '';
    const savedAnthropicKey = localStorage.getItem('anthropic_api_key') || '';
    
    setApiKeys({
      openai: savedOpenAIKey,
      anthropic: savedAnthropicKey
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateApiKeys = async () => {
    setIsValidating(true);
    setValidationResults(null);
    
    // In a real implementation, this would call the API validation endpoint
    // Simulating API validation
    setTimeout(() => {
      const results = {
        openai: {
          success: apiKeys.openai.startsWith('sk-') && apiKeys.openai.length > 20,
          message: apiKeys.openai.startsWith('sk-') && apiKeys.openai.length > 20 
            ? 'OpenAI API key is valid' 
            : 'Invalid OpenAI API key format'
        },
        anthropic: {
          success: apiKeys.anthropic.startsWith('sk-') && apiKeys.anthropic.length > 20,
          message: apiKeys.anthropic.startsWith('sk-') && apiKeys.anthropic.length > 20 
            ? 'Anthropic API key is valid' 
            : 'Invalid Anthropic API key format'
        }
      };
      
      setValidationResults(results);
      setIsValidating(false);
    }, 1500);
  };

  const saveApiKeys = () => {
    setIsSaving(true);
    
    // Save to localStorage
    localStorage.setItem('openai_api_key', apiKeys.openai);
    localStorage.setItem('anthropic_api_key', apiKeys.anthropic);
    
    // In a real implementation, this would also save to the server
    
    // Show success message
    setSaveMessage({
      type: 'success',
      text: 'API keys saved successfully'
    });
    
    setTimeout(() => {
      setIsSaving(false);
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">API Keys</h2>
        <p className="text-gray-600 mb-6">
          Enter your API keys for OpenAI and Anthropic to enable communication with Claude and ChatGPT.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="openai">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="openai"
              name="openai"
              value={apiKeys.openai}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="sk-..."
            />
            {validationResults?.openai && (
              <p className={`mt-2 text-sm ${validationResults.openai.success ? 'text-green-600' : 'text-red-600'}`}>
                {validationResults.openai.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="anthropic">
              Anthropic API Key
            </label>
            <input
              type="password"
              id="anthropic"
              name="anthropic"
              value={apiKeys.anthropic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="sk-..."
            />
            {validationResults?.anthropic && (
              <p className={`mt-2 text-sm ${validationResults.anthropic.success ? 'text-green-600' : 'text-red-600'}`}>
                {validationResults.anthropic.message}
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={validateApiKeys}
              disabled={isValidating || !apiKeys.openai || !apiKeys.anthropic}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Validate Keys'}
            </button>
            
            <button
              onClick={saveApiKeys}
              disabled={isSaving || !apiKeys.openai || !apiKeys.anthropic}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Keys'}
            </button>
          </div>
          
          {saveMessage && (
            <div className={`mt-4 p-3 rounded-md ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {saveMessage.text}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Version</h3>
            <p className="text-gray-600">MCP System v1.0.0</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Environment</h3>
            <p className="text-gray-600">Development</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Database</h3>
            <p className="text-gray-600">MongoDB</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Memory Storage</h3>
            <p className="text-gray-600">Redis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
