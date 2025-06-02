import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CommentSection = ({ messages, currentUser, teamId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages || []);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Update local messages when props change
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Create a new message object
      const newMessageObj = {
        id: `msg-${Date.now()}`,
        sender: currentUser,
        senderName: currentUser === 'alex_chen' ? 'Alex Chen' : 
                   currentUser === 'sarah_dev' ? 'Sarah Johnson' :
                   currentUser === 'mike_backend' ? 'Mike Rodriguez' : 'Emma Wilson',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        avatar: currentUser === 'alex_chen' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' :
                currentUser === 'sarah_dev' ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' :
                currentUser === 'mike_backend' ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      };
      
      // Add the new message to the local state
      setLocalMessages(prev => [...prev, newMessageObj]);
      setNewMessage('');
      setIsTyping(false);
      
      // Here you would typically send to backend
      console.log('Sending message:', newMessage);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCurrentUser = (sender) => sender === currentUser;

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm flex flex-col h-96">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="MessageCircle" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Team Chat</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-text-secondary">4 online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {localMessages.map((message) => {
          const isOwn = isCurrentUser(message.sender);
          
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-2 max-w-xs lg:max-w-sm ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!isOwn && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image 
                        src={message.avatar} 
                        alt={message.senderName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  {!isOwn && (
                    <span className="text-xs text-text-secondary font-medium mb-1">
                      {message.senderName}
                    </span>
                  )}
                  
                  <div className={`px-3 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-primary text-white' :'bg-surface text-text-primary border border-border'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.message}</p>
                  </div>
                  
                  <span className="text-xs text-text-tertiary mt-1">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2 max-w-xs">
              <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-text-tertiary" />
              </div>
              <div className="bg-surface border border-border px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full px-3 py-2 pr-10 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              maxLength={500}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <Icon name="Smile" size={16} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-3 py-2 rounded-md transition-colors ${
              newMessage.trim()
                ? 'bg-primary text-white hover:bg-primary-hover' :'bg-surface text-text-tertiary cursor-not-allowed'
            }`}
          >
            <Icon name="Send" size={16} />
          </button>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
          <span>Press Enter to send</span>
          <span>{newMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;