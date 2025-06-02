import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InviteCodeGenerator = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my team!',
        text: `Join my hackathon team using invite code: ${code}`,
        url: window.location.origin + '/team-formation-screen'
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="mb-4 p-3 bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-1">Team Invite Code</h4>
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 bg-background border border-border rounded text-sm font-mono text-primary">
              {code}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-primary hover:bg-opacity-10 rounded transition-colors"
              title="Copy to clipboard"
            >
              <Icon 
                name={copied ? "Check" : "Copy"} 
                size={14} 
                className={copied ? "text-success" : "text-text-tertiary"} 
              />
            </button>
          </div>
        </div>
        <button
          onClick={shareCode}
          className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-hover transition-colors"
        >
          <Icon name="Share2" size={14} />
          Share
        </button>
      </div>
      <p className="text-xs text-text-secondary mt-2">
        Share this code with potential team members to invite them
      </p>
    </div>
  );
};

export default InviteCodeGenerator;