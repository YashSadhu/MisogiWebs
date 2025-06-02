import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ProjectIdeaBoard = ({ ideas, teamId, currentUser }) => {
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [votedIdeas, setVotedIdeas] = useState(new Set());
  const [localIdeas, setLocalIdeas] = useState(ideas || []);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    techStack: []
  });
  const [newTechTag, setNewTechTag] = useState('');

  // Update local ideas when props change
  useEffect(() => {
    if (ideas) {
      setLocalIdeas(ideas);
    }
  }, [ideas]);

  const handleVote = (ideaId) => {
    setVotedIdeas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });
  };

  const handleAddTechTag = () => {
    if (newTechTag.trim() && !newIdea.techStack.includes(newTechTag.trim())) {
      setNewIdea(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTechTag.trim()]
      }));
      setNewTechTag('');
    }
  };

  const handleRemoveTechTag = (tagToRemove) => {
    setNewIdea(prev => ({
      ...prev,
      techStack: prev.techStack.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmitIdea = (e) => {
    e.preventDefault();
    if (newIdea.title.trim() && newIdea.description.trim()) {
      // Create a new idea object
      const newIdeaObj = {
        id: `idea-${Date.now()}`,
        title: newIdea.title.trim(),
        description: newIdea.description.trim(),
        techStack: [...newIdea.techStack],
        author: currentUser,
        authorName: currentUser === 'alex_chen' ? 'Alex Chen' : 
                   currentUser === 'sarah_dev' ? 'Sarah Johnson' :
                   currentUser === 'mike_backend' ? 'Mike Rodriguez' : 'Emma Wilson',
        votes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasVoted: false
      };
      
      // Add the new idea to the local state
      setLocalIdeas(prev => [newIdeaObj, ...prev]);
      setNewIdea({ title: '', description: '', techStack: [] });
      setShowNewIdeaForm(false);
      
      // Here you would typically submit to backend
      console.log('Submitting new idea:', newIdea);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Lightbulb" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Project Ideas</h2>
            <span className="bg-primary bg-opacity-10 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {ideas.length}
            </span>
          </div>
          <button
            onClick={() => setShowNewIdeaForm(!showNewIdeaForm)}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
          >
            <Icon name="Plus" size={16} />
            <span>Add Idea</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* New Idea Form */}
        {showNewIdeaForm && (
          <div className="bg-surface border border-border rounded-lg p-4">
            <form onSubmit={handleSubmitIdea} className="space-y-4">
              <div>
                <label htmlFor="idea-title" className="block text-sm font-medium text-text-primary mb-2">
                  Project Title
                </label>
                <input
                  id="idea-title"
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your project idea title..."
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="idea-description" className="block text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  id="idea-description"
                  value={newIdea.description}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project idea in detail..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-text-tertiary mt-1">
                  {newIdea.description.length}/500 characters
                </div>
              </div>

              <div>
                <label htmlFor="tech-stack" className="block text-sm font-medium text-text-primary mb-2">
                  Technology Stack
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    id="tech-stack"
                    type="text"
                    value={newTechTag}
                    onChange={(e) => setNewTechTag(e.target.value)}
                    placeholder="Add technology..."
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechTag())}
                  />
                  <button
                    type="button"
                    onClick={handleAddTechTag}
                    className="px-3 py-2 bg-surface border border-border rounded-md hover:bg-border transition-colors"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newIdea.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs font-medium rounded-md"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(tech)}
                        className="hover:text-primary-hover"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover transition-colors font-medium"
                >
                  Post Idea
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewIdeaForm(false)}
                  className="px-4 py-2 border border-border rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ideas List */}
        {localIdeas.map((idea) => {
          const hasVoted = votedIdeas.has(idea.id) || idea.hasVoted;
          const isExpanded = selectedIdea === idea.id;
          
          return (
            <div key={idea.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{idea.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <span>by {idea.authorName}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(idea.createdAt)}</span>
                    {idea.updatedAt !== idea.createdAt && (
                      <>
                        <span>•</span>
                        <span>edited {formatTimeAgo(idea.updatedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {idea.author === currentUser && (
                  <button className="p-1 text-text-tertiary hover:text-text-secondary transition-colors">
                    <Icon name="MoreVertical" size={16} />
                  </button>
                )}
              </div>

              <div className="mb-4">
                <p className="text-text-secondary leading-relaxed">
                  {isExpanded ? idea.description : `${idea.description.substring(0, 200)}${idea.description.length > 200 ? '...' : ''}`}
                </p>
                {idea.description.length > 200 && (
                  <button
                    onClick={() => setSelectedIdea(isExpanded ? null : idea.id)}
                    className="text-primary hover:text-primary-hover text-sm font-medium mt-2"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {idea.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-surface text-text-secondary text-xs font-medium rounded-md border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(idea.id)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                      hasVoted
                        ? 'bg-primary bg-opacity-10 text-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }`}
                  >
                    <Icon name={hasVoted ? "Heart" : "Heart"} size={16} fill={hasVoted ? "currentColor" : "none"} />
                    <span className="text-sm font-medium">{idea.votes + (votedIdeas.has(idea.id) ? (idea.hasVoted ? 0 : 1) : (idea.hasVoted ? -1 : 0))}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors">
                    <Icon name="MessageCircle" size={16} />
                    <span className="text-sm">{idea.comments}</span>
                  </button>
                </div>

                <button className="flex items-center space-x-1 text-text-tertiary hover:text-text-secondary transition-colors">
                  <Icon name="Share2" size={16} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          );
        })}

        {ideas.length === 0 && !showNewIdeaForm && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
                <Icon name="Lightbulb" size={24} className="text-text-tertiary" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No project ideas yet</h3>
            <p className="text-text-secondary mb-4">Be the first to share your innovative project idea with the team!</p>
            <button
              onClick={() => setShowNewIdeaForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Icon name="Plus" size={16} />
              <span>Add First Idea</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectIdeaBoard;