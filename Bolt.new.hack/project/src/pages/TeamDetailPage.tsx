import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Plus, MessageSquare } from 'lucide-react';
import useTeamStore from '../store/teamStore';
import useAuthStore from '../store/authStore';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Avatar from '../components/ui/Avatar';
import InviteCard from '../components/teams/InviteCard';
import ProjectIdeaCard from '../components/projects/ProjectIdeaCard';
import ProjectIdeaForm from '../components/forms/ProjectIdeaForm';
import { User } from '../types';

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentTeam, 
    isLoading, 
    error, 
    fetchTeamById, 
    getUserSuggestions,
    inviteUser,
    createProjectIdea,
    addEndorsement,
    clearError
  } = useTeamStore();
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchTeamById(id);
    }
  }, [id, fetchTeamById]);
  
  useEffect(() => {
    const loadSuggestions = async () => {
      if (id) {
        setLoadingSuggestions(true);
        try {
          const suggestions = await getUserSuggestions(id);
          setUserSuggestions(suggestions);
        } catch (error) {
          console.error('Failed to load user suggestions', error);
        } finally {
          setLoadingSuggestions(false);
        }
      }
    };
    
    loadSuggestions();
  }, [id, getUserSuggestions]);
  
  const handleInviteUser = async (userId: string) => {
    if (!id) return;
    
    try {
      await inviteUser(id, userId);
      // Remove invited user from suggestions
      setUserSuggestions(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      setInviteError('Failed to invite user. Please try again.');
    }
  };
  
  const handleCreateProjectIdea = async (data: { title: string; description: string; techStack: string[] }) => {
    if (!id) return;
    
    try {
      await createProjectIdea(id, data.title, data.description, data.techStack);
      setShowProjectForm(false);
    } catch (error) {
      setProjectError('Failed to create project idea. Please try again.');
    }
  };
  
  const handleEndorseProject = async () => {
    if (!currentTeam?.projectIdea?.id) return;
    
    try {
      await addEndorsement(currentTeam.projectIdea.id);
    } catch (error) {
      console.error('Failed to endorse project', error);
    }
  };
  
  const handleCommentProject = () => {
    // Implement comment functionality
    console.log('Comment on project');
  };
  
  const isTeamOwner = currentTeam?.ownerId === user?.id;
  const hasEndorsed = currentTeam?.projectIdea?.endorsements.some(e => e.userId === user?.id) || false;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="error" onClose={clearError}>
          {error}
        </Alert>
        <div className="mt-4 text-center">
          <Button variant="primary" onClick={() => navigate('/teams')}>
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }
  
  if (!currentTeam) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="error">
          Team not found
        </Alert>
        <div className="mt-4 text-center">
          <Button variant="primary" onClick={() => navigate('/teams')}>
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentTeam.name}</h1>
            <p className="text-gray-600 mt-1">{currentTeam.description}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate('/teams')}
            >
              Back to Teams
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800">Project Idea</h2>
            </CardHeader>
            
            <CardContent>
              {projectError && (
                <Alert variant="error\" onClose={() => setProjectError(null)} className="mb-6">
                  {projectError}
                </Alert>
              )}
              
              {currentTeam.projectIdea ? (
                <ProjectIdeaCard
                  projectIdea={currentTeam.projectIdea}
                  onEndorse={handleEndorseProject}
                  onComment={handleCommentProject}
                  hasEndorsed={hasEndorsed}
                />
              ) : showProjectForm ? (
                <ProjectIdeaForm
                  onSubmit={handleCreateProjectIdea}
                  isLoading={isLoading}
                  error={projectError}
                  onClearError={() => setProjectError(null)}
                />
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Idea Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Share your project idea with your team to start collaborating.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowProjectForm(true)}
                  >
                    Create Project Idea
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
            </CardHeader>
            
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {currentTeam.members.map((member) => (
                  <li key={member.userId} className="py-4 flex items-center">
                    <Avatar
                      src={member.user.avatarUrl}
                      name={member.user.name}
                      size="md"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {member.role === 'owner' ? 'Team Owner' : 'Member'} • Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {isTeamOwner && (
            <InviteCard inviteCode={currentTeam.inviteCode} />
          )}
          
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800">Suggested Members</h2>
            </CardHeader>
            
            <CardContent>
              {inviteError && (
                <Alert variant="error\" onClose={() => setInviteError(null)} className="mb-6">
                  {inviteError}
                </Alert>
              )}
              
              {loadingSuggestions ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : userSuggestions.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {userSuggestions.map((user) => (
                    <li key={user.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar
                          src={user.avatarUrl}
                          name={user.name}
                          size="md"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            {user.skills.map(s => s.name).join(', ')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => handleInviteUser(user.id)}
                      >
                        Invite
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No suggestions available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;