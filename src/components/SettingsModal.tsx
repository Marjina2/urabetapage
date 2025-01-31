import { FC } from 'react';
import styles from '@/styles/Settings.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    geminiApiKey?: string;
    newsApiKey?: string;
  };
  onSave: (settings: any) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const handleSettingChange = (key: string, value: string) => {
    onSave({ ...settings, [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>API Settings</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Gemini API Section */}
          <div className={styles.settingSection}>
            <div className={styles.sectionHeader}>
              <h3>Gemini API</h3>
              <span className={styles.apiStatus}>
                {settings.geminiApiKey ? (
                  <span className={styles.active}>
                    <i className="fas fa-check-circle"></i> Active
                  </span>
                ) : (
                  <span className={styles.inactive}>
                    <i className="fas fa-exclamation-circle"></i> Not Configured
                  </span>
                )}
              </span>
            </div>
            {/* Existing Gemini API settings */}
          </div>

          {/* NewsAPI Section */}
          <div className={styles.settingSection}>
            <div className={styles.sectionHeader}>
              <h3>NewsAPI</h3>
              <span className={styles.apiStatus}>
                {settings.newsApiKey ? (
                  <span className={styles.active}>
                    <i className="fas fa-check-circle"></i> Active
                  </span>
                ) : (
                  <span className={styles.inactive}>
                    <i className="fas fa-exclamation-circle"></i> Not Configured
                  </span>
                )}
              </span>
            </div>

            <div className={styles.settingField}>
              <label htmlFor="newsApiKey">API Key</label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  id="newsApiKey"
                  value={settings.newsApiKey || ''}
                  onChange={(e) => handleSettingChange('newsApiKey', e.target.value)}
                  placeholder="Enter your NewsAPI key"
                />
                <i className="fas fa-key"></i>
              </div>
            </div>

            <div className={styles.documentation}>
              <h4>Documentation</h4>
              <div className={styles.docSection}>
                <h5>Getting Started</h5>
                <ol>
                  <li>Visit <a href="https://newsapi.org/register" target="_blank" rel="noopener noreferrer">NewsAPI.org</a> to create an account</li>
                  <li>Complete the registration process</li>
                  <li>Copy your API key from the dashboard</li>
                  <li>Paste the key in the field above</li>
                </ol>
              </div>

              <div className={styles.docSection}>
                <h5>Features</h5>
                <ul>
                  <li>Search news from multiple sources</li>
                  <li>Filter by date, language, and category</li>
                  <li>Access top headlines</li>
                  <li>Real-time news updates</li>
                </ul>
              </div>

              <div className={styles.docSection}>
                <h5>Usage Limits</h5>
                <ul>
                  <li>Developer Plan: 100 requests per day</li>
                  <li>Results per request: Up to 100 articles</li>
                  <li>Rate limit: 50 calls per day</li>
                </ul>
              </div>

              <div className={styles.docLinks}>
                <a href="https://newsapi.org/docs" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-book"></i> Full Documentation
                </a>
                <a href="https://newsapi.org/pricing" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-tag"></i> Pricing Plans
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 