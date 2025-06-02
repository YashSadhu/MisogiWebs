import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import SkillMatchIndicator from './SkillMatchIndicator';
import InviteCodeGenerator from './InviteCodeGenerator';

const TeamCard = ({ team, variant = 'available', onJoinRequest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRequest = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onJoinRequest(team.id);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-success bg-success bg-opacity-10';
      case 'Pending':
        return 'text-warning bg-warning bg-opacity-10';
      case 'Completed':
        return 'text-text-tertiary bg-surface';
      default:
        return 'text-text-tertiary bg-surface';
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Team Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-text-primary">{team.name}</h3>
            {variant === 'my-team' && team.teamStatus && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(team.teamStatus)}`}>
                {team.teamStatus}
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mb-2">{team.hackathonName}</p>
          
          {/* Team Lead */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image 
                src={team.teamLeadAvatar || team.members[0]?.avatar} 
                alt={team.teamLead}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-text-secondary">
              Led by {team.isOwner ? 'You' : team.teamLead}
            </span>
          </div>
        </div>

        {/* Member Count */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Icon name="Users" size={16} />
          <span>{team.currentMembers}/{team.maxMembers}</span>
        </div>
      </div>

      {/* Skill Match Indicator (for available teams) */}
      {variant === 'available' && (
        <SkillMatchIndicator percentage={team.skillMatchPercentage} />
      )}

      {/* Team Description */}
      <div className="mb-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isExpanded ? team.description : `${team.description.substring(0, 150)}...`}
        </p>
        {team.description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-sm font-medium hover:text-primary-hover transition-colors mt-1"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Project Idea */}
      {team.projectIdea && (
        <div className="mb-4 p-3 bg-surface rounded-lg">
          <h4 className="text-sm font-medium text-text-primary mb-1">Project Idea</h4>
          <p className="text-sm text-text-secondary">{team.projectIdea}</p>
        </div>
      )}

      {/* Tech Stack */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-text-primary mb-2">Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {team.techStack?.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Required Skills */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-text-primary mb-2">Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {team.requiredSkills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-md border border-border"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-text-primary mb-2">Team Members</h4>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((member, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                title={member.name}
              >
                <Image 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {team.members.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-background bg-surface flex items-center justify-center">
                <span className="text-xs text-text-secondary">+{team.members.length - 4}</span>
              </div>
            )}
          </div>
          <span className="text-sm text-text-secondary ml-2">
            {team.currentMembers} member{team.currentMembers !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Invite Code (for owned teams) */}
      {variant === 'my-team' && team.isOwner && team.inviteCode && (
        <InviteCodeGenerator code={team.inviteCode} />
      )}

      {/* Pending Requests (for owned teams) */}
      {variant === 'my-team' && team.isOwner && team.pendingRequests > 0 && (
        <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">
              {team.pendingRequests} pending join request{team.pendingRequests !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        {variant === 'available' && (
          <>
            {team.isFull ? (
              <button
                disabled
                className="flex-1 py-2 px-4 bg-surface text-text-tertiary border border-border rounded-lg cursor-not-allowed"
              >
                Team Full
              </button>
            ) : team.isRequestSent ? (
              <button
                disabled
                className="flex-1 py-2 px-4 bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 rounded-lg cursor-not-allowed"
              >
                Request Sent
              </button>
            ) : (
              <button
                onClick={handleJoinRequest}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  'Request to Join'
                )}
              </button>
            )}
            <Link
              to="/hackathon-details-registration-screen"
              className="py-2 px-4 bg-surface text-text-primary border border-border rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Icon name="ExternalLink" size={16} />
            </Link>
          </>
        )}

        {variant === 'my-team' && (
          <>
            <Link
              to="/team-dashboard-screen"
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-center"
            >
              Manage Team
            </Link>
            <button className="py-2 px-4 bg-surface text-text-primary border border-border rounded-lg hover:bg-gray-100 transition-colors">
              <Icon name="Settings" size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamCard;