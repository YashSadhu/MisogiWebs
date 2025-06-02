import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MembersList = ({ members, teamLeader }) => {
  const [showAllSkills, setShowAllSkills] = useState({});

  const toggleSkills = (memberId) => {
    setShowAllSkills(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Team Members</h2>
          <span className="bg-primary bg-opacity-10 text-primary text-xs font-medium px-2 py-1 rounded-full">
            {members.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {members.map((member) => {
          const isLeader = member.username === teamLeader;
          const skillsToShow = showAllSkills[member.id] ? member.skills : member.skills.slice(0, 3);
          const hasMoreSkills = member.skills.length > 3;

          return (
            <div key={member.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface transition-colors">
              {/* Avatar with online status */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {member.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-text-primary truncate">{member.name}</h3>
                  {isLeader && (
                    <div className="flex items-center space-x-1 bg-primary bg-opacity-10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                      <Icon name="Crown" size={12} />
                      <span>Leader</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-text-secondary">@{member.username}</span>
                  <span className="text-xs text-text-tertiary">•</span>
                  <span className="text-xs text-text-secondary">{member.role}</span>
                  <span className="text-xs text-text-tertiary">•</span>
                  <span className="text-xs text-text-secondary">Joined {formatJoinDate(member.joinedAt)}</span>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {skillsToShow.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-surface text-text-secondary border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {hasMoreSkills && (
                    <button
                      onClick={() => toggleSkills(member.id)}
                      className="text-xs text-primary hover:text-primary-hover font-medium flex items-center space-x-1"
                    >
                      <span>
                        {showAllSkills[member.id] 
                          ? 'Show less' 
                          : `+${member.skills.length - 3} more`
                        }
                      </span>
                      <Icon 
                        name={showAllSkills[member.id] ? "ChevronUp" : "ChevronDown"} 
                        size={12} 
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <button className="p-1 text-text-tertiary hover:text-text-secondary transition-colors">
                  <Icon name="MoreVertical" size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Button */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors">
          <Icon name="UserPlus" size={16} />
          <span className="text-sm font-medium">Invite Team Member</span>
        </button>
      </div>
    </div>
  );
};

export default MembersList;