import React from 'react';
import Icon from '../AppIcon';

const Card = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  header,
  footer,
  image,
  badge,
  ...props
}) => {
  const baseClasses = 'bg-background border border-border rounded-lg shadow-sm transition-all duration-200';

  const variantClasses = {
    default: '',
    interactive: 'hover:shadow-md hover:border-primary/20 cursor-pointer',
    featured: 'border-primary shadow-md bg-gradient-to-br from-primary/5 to-transparent',
    compact: 'p-3',
    team: 'hover:shadow-md hover:border-primary/20 cursor-pointer',
    project: 'hover:shadow-md hover:border-primary/20 cursor-pointer'
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      {...props}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          {badge}
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="relative">
          {image}
          {badge && (
            <div className="absolute top-3 right-3">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      {header && (
        <div className="px-6 py-4 border-b border-border">
          {header}
        </div>
      )}

      {/* Content */}
      <div className={variant === 'compact' ? 'p-3' : 'p-6'}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-surface rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

// Card Title Component
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-text-primary ${className}`}>
    {children}
  </h3>
);

// Card Description Component
const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-text-secondary mt-1 ${className}`}>
    {children}
  </p>
);

// Card Content Component
const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Card Footer Component
const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
);

// Team Card Variant
const TeamCard = ({ team, onJoin, onView, className = '' }) => (
  <Card variant="team" className={className}>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>{team.description}</CardDescription>
        </div>
        <div className="flex items-center space-x-1 text-text-tertiary">
          <Icon name="Users" size={16} />
          <span className="text-sm">{team.memberCount}/{team.maxMembers}</span>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-2">Skills Needed</h4>
          <div className="flex flex-wrap gap-2">
            {team.skillsNeeded?.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-team-tag-bg text-team-tag-text text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-text-primary mb-2">Hackathon</h4>
          <span className="px-2 py-1 bg-hackathon-tag-bg text-hackathon-tag-text text-xs rounded-full">
            {team.hackathon}
          </span>
        </div>
      </div>
    </CardContent>

    <CardFooter>
      <div className="flex space-x-2">
        <button
          onClick={() => onView?.(team)}
          className="flex-1 px-3 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-md hover:bg-gray-100 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onJoin?.(team)}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover transition-colors"
        >
          Request to Join
        </button>
      </div>
    </CardFooter>
  </Card>
);

// Project Card Variant
const ProjectCard = ({ project, onView, className = '' }) => (
  <Card variant="project" className={className}>
    {project.image && (
      <div className="aspect-video bg-surface rounded-t-lg overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/assets/images/no_image.png";
          }}
        />
      </div>
    )}

    <CardHeader>
      <CardTitle>{project.title}</CardTitle>
      <CardDescription>{project.description}</CardDescription>
    </CardHeader>

    <CardContent>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-full font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>{project.teamSize} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>{project.duration}</span>
          </div>
        </div>
      </div>
    </CardContent>

    <CardFooter>
      <button
        onClick={() => onView?.(project)}
        className="w-full px-3 py-2 text-sm font-medium text-primary bg-primary-light rounded-md hover:bg-primary hover:text-white transition-colors"
      >
        View Project
      </button>
    </CardFooter>
  </Card>
);

// Export all components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Team = TeamCard;
Card.Project = ProjectCard;

export default Card;