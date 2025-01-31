import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";

interface ApiSettingsPopupProps {
  onClose: () => void;
  onApiConfigured: () => void;
}

interface ModelInfo {
  name: string;
  docUrl: string;
  isPremium: boolean;
}

const ApiSettingsPopup: React.FC<ApiSettingsPopupProps> = ({ onClose, onApiConfigured }) => {
  const [useURA, setUseURA] = useState(true);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  const [customModels, setCustomModels] = useState<{[key: string]: string}>({});
  const [newModelName, setNewModelName] = useState('');
  const [newModelKey, setNewModelKey] = useState('');

  const freeModels: ModelInfo[] = [
    {
      name: "Gemini Flash API",
      docUrl: "https://docs.geminiflashapi.com",
      isPremium: false
    },
    {
      name: "SerpAPI",
      docUrl: "https://docs.serpapi.com",
      isPremium: false
    }
  ];

  const premiumModels: ModelInfo[] = [
    {
      name: "OpenAI GPT-4",
      docUrl: "https://platform.openai.com/docs",
      isPremium: true
    },
    {
      name: "DeepL API",
      docUrl: "https://www.deepl.com/docs-api",
      isPremium: true
    },
    {
      name: "Claude (Anthropic)",
      docUrl: "https://docs.anthropic.com/claude",
      isPremium: true
    },
    {
      name: "DeepSeek AI",
      docUrl: "https://docs.deepseek.ai",
      isPremium: true
    }
  ];

  const handleToggleModel = (model: string) => {
    setApiKeys((prev) => {
      const isEnabled = model in prev;
      const newKeys = { ...prev };
      if (isEnabled) {
        delete newKeys[model];
      } else {
        newKeys[model] = '';
      }
      return newKeys;
    });
  };

  const handleApiKeyChange = (model: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [model]: value
    }));
  };

  const handleSaveApiKey = (model: string, value: string) => {
    // Save to Supabase
    const saveApiKey = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('Please sign in to save API keys');
          return;
        }

        const { error } = await supabase
          .from('api_keys')
          .upsert({
            user_id: session.user.id,
            provider: model,
            api_key: value
          });

        if (error) throw error;

        // Update local state to show the key is saved
        setSavedKeys(prev => ({
          ...prev,
          [model]: true
        }));
        
        // Notify parent that APIs are configured
        onApiConfigured();
        
        toast.success('API key saved successfully');
      } catch (error) {
        console.error('Error saving API key:', error);
        toast.error('Failed to save API key');
      }
    };

    saveApiKey();
  };

  const handleDeleteApiKey = async (model: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to delete API key');
        return;
      }

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .match({ user_id: session.user.id, provider: model });

      if (error) throw error;

      // Update local state
      setApiKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[model];
        return newKeys;
      });
      setSavedKeys(prev => {
        const newSaved = { ...prev };
        delete newSaved[model];
        return newSaved;
      });

      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  // Load saved API keys on mount
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: keys, error } = await supabase
          .from('api_keys')
          .select('provider, api_key')
          .eq('user_id', session.user.id);

        if (error) throw error;

        if (keys) {
          const loadedKeys: Record<string, string> = {};
          const loadedSavedState: Record<string, boolean> = {};
          
          keys.forEach(({ provider, api_key }) => {
            loadedKeys[provider] = api_key;
            loadedSavedState[provider] = true;
          });

          setApiKeys(loadedKeys);
          setSavedKeys(loadedSavedState);

          // If any keys are loaded, notify parent
          if (keys.length > 0) {
            onApiConfigured();
          }
        }
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    };

    loadApiKeys();
  }, []);

  const handleCustomModelKeyChange = (modelName: string, value: string) => {
    setCustomModels(prev => ({
      ...prev,
      [modelName]: value
    }));
  };

  const handleAddCustomModel = () => {
    // Implementation of adding a new custom model
  };

  const handleRemoveCustomModel = (modelName: string) => {
    // Implementation of removing a custom model
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1C1C1E] w-[600px] max-h-[80vh] overflow-y-auto rounded-2xl p-8 shadow-2xl relative border border-purple-500/20"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Title and Description */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">API Settings</h2>
          <p className="text-gray-400 text-sm">
            Choose between URA AI's built-in models or configure your own custom API integrations
          </p>
        </motion.div>

        {/* Toggle Switch */}
        <div className="flex justify-center items-center mb-8">
          <motion.div 
            className="bg-[#252544] rounded-full p-1 flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                useURA
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setUseURA(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              URA AI
            </motion.button>
            <motion.button
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                !useURA
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setUseURA(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Custom Models
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {useURA ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-gray-400 p-8 bg-[#252544]/50 rounded-xl border border-purple-500/20"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <i className="fas fa-check-circle text-4xl text-purple-500 mb-4"></i>
                <p className="text-lg font-medium text-white mb-2">Using URA AI</p>
                <p className="text-sm text-gray-400">All API configurations are managed automatically with our optimized models.</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Free Models */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  Free Models
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    No Credit Card Required
                  </span>
                </h3>
                <div className="space-y-4">
                  {freeModels.map((model) => (
                    <ModelInput
                      key={model.name}
                      model={model}
                      apiKeys={apiKeys}
                      savedKeys={savedKeys}
                      onToggle={handleToggleModel}
                      onChange={handleApiKeyChange}
                      onSave={handleSaveApiKey}
                      onDelete={handleDeleteApiKey}
                      isPremium={model.isPremium}
                    />
                  ))}
                </div>
              </div>

              {/* Premium Models */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  Premium Models
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    Subscription Required
                  </span>
                </h3>
                <div className="space-y-4">
                  {premiumModels.map((model) => (
                    <ModelInput
                      key={model.name}
                      model={model}
                      apiKeys={apiKeys}
                      savedKeys={savedKeys}
                      onToggle={handleToggleModel}
                      onChange={handleApiKeyChange}
                      onSave={handleSaveApiKey}
                      onDelete={handleDeleteApiKey}
                      isPremium={model.isPremium}
                    />
                  ))}
                </div>
              </div>

              {/* API Key Inputs */}
              <div className="space-y-4 mt-6">
                {/* Gemini API Key */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.gemini}
                    onChange={(e) => handleApiKeyChange('gemini', e.target.value)}
                    className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-2
                             text-white placeholder-gray-500 focus:border-purple-500
                             focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                    placeholder="Enter your Gemini API key"
                  />
                </div>

                {/* Custom Models Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Custom Models</h3>
                  
                  {/* Add New Model Form */}
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      className="flex-1 bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-2
                               text-white placeholder-gray-500 focus:border-purple-500
                               focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      placeholder="Model name"
                    />
                    <input
                      type="password"
                      value={newModelKey}
                      onChange={(e) => setNewModelKey(e.target.value)}
                      className="flex-1 bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-2
                               text-white placeholder-gray-500 focus:border-purple-500
                               focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      placeholder="API key"
                    />
                    <button
                      onClick={handleAddCustomModel}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600
                               transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* Custom Models List */}
                  <div className="space-y-4">
                    {Object.entries(customModels).map(([name, key]) => (
                      <div key={name} className="flex gap-4 items-center">
                        <input
                          type="text"
                          value={name}
                          readOnly
                          className="flex-1 bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-2
                                   text-white opacity-50"
                        />
                        <input
                          type="password"
                          value={key}
                          onChange={(e) => handleCustomModelKeyChange(name, e.target.value)}
                          className="flex-1 bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-2
                                   text-white placeholder-gray-500 focus:border-purple-500
                                   focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                          placeholder="API key"
                        />
                        <button
                          onClick={() => handleRemoveCustomModel(name)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ModelInput component
interface ModelInputProps {
  model: ModelInfo;
  apiKeys: Record<string, string>;
  savedKeys: Record<string, boolean>;
  onToggle: (model: string) => void;
  onChange: (model: string, value: string) => void;
  onSave: (model: string, value: string) => void;
  onDelete: (model: string) => void;
  isPremium?: boolean;
}

const ModelInput: React.FC<ModelInputProps> = ({
  model,
  apiKeys,
  savedKeys,
  onToggle,
  onChange,
  onSave,
  onDelete,
  isPremium
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const isSaved = savedKeys[model.name];
  const apiKey = apiKeys[model.name] || '';

  // Determine if the input should be editable
  const isInputEditable = !isSaved || isEditing;

  return (
    <div className="bg-[#1E1E2E] rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white text-lg">{model.name}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(model.name)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
              model.name in apiKeys ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                model.name in apiKeys ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {model.name in apiKeys && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={isInputEditable ? "text" : "password"}
                    value={isInputEditable ? (isEditing ? tempKey : apiKey) : apiKey}
                    onChange={(e) => {
                      if (isInputEditable) {
                        if (isEditing) {
                          setTempKey(e.target.value);
                        } else {
                          onChange(model.name, e.target.value);
                        }
                      }
                    }}
                    placeholder="Enter API key"
                    readOnly={!isInputEditable}
                    className="w-full bg-[#252544] border border-purple-500/20 rounded-lg px-4 py-2 
                              text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                              pr-10"
                  />
                  {isSaved && (
                    <button
                      onClick={() => onDelete(model.name)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 
                               hover:text-red-300 transition-colors p-1"
                      title="Delete API key"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onSave(model.name, tempKey);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg 
                               hover:bg-purple-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (isSaved) {
                        setTempKey(apiKey);
                        setIsEditing(true);
                      } else {
                        onSave(model.name, apiKey);
                      }
                    }}
                    className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg 
                             hover:bg-purple-600 transition-colors"
                  >
                    {isSaved ? 'Change' : 'Save'}
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>API Key Required</span>
                <a
                  href={model.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Get API Key
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiSettingsPopup;
