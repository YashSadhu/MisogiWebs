import React from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { ProjectIdea } from '../../types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate } from '../../utils/dates';

interface ProjectIdeaCardProps {
  projectIdea: ProjectIdea;
  onEndorse: () => void;
  onComment: () => void;
  hasEndorsed: boolean;
}

const ProjectIdeaCard: React.FC<ProjectIdeaCardProps> = ({
  projectIdea,
  onEndorse,
  onComment,
  hasEndorsed
}) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-gray-900">{projectIdea.title}</h3>
        <p className="text-sm text-gray-500">Last updated: {formatDate(projectIdea.updatedAt)}</p>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4">{projectIdea.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tech Stack:</h4>
          <div className="flex flex-wrap gap-2">
            {projectIdea.techStack.map((tech, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{projectIdea.endorsements.length} endorsements</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{projectIdea.comments.length} comments</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex space-x-2">
        <Button
          variant={hasEndorsed ? 'outline' : 'primary'}
          leftIcon={<ThumbsUp className="h-4 w-4" />}
          onClick={onEndorse}
          disabled={hasEndorsed}
        >
          {hasEndorsed ? 'Endorsed' : 'Endorse'}
        </Button>
        <Button
          variant="outline"
          leftIcon={<MessageSquare className="h-4 w-4" />}
          onClick={onComment}
        >
          Comment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectIdeaCard;