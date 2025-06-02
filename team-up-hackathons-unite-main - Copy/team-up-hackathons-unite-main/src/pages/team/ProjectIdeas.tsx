import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, ThumbsUp, MessageSquare, Calendar, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useProjectIdeaStore } from '@/stores/projectIdeaStore';
import { useTeamStore } from '@/stores/teamStore';
import { ProjectIdea, ProjectComment, Team } from '@/types/teamTypes';

const ProjectIdeas = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    projectIdeas, 
    userVotes,
    addIdea, 
    voteForIdea, 
    removeVote,
    addComment
  } = useProjectIdeaStore();
  
  // Team data
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  
  // Comment state
  const [newComment, setNewComment] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  
  // New idea form state
  const [showNewIdeaDialog, setShowNewIdeaDialog] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDescription, setNewIdeaDescription] = useState('');
  const [newIdeaCategory, setNewIdeaCategory] = useState('web');
  const [newIdeaTechTags, setNewIdeaTechTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [submittingIdea, setSubmittingIdea] = useState(false);
  
  // Handle going back to team details
  const handleGoBack = () => {
    navigate(`/team/${teamId}`);
  };
  
  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock team data
      const mockTeam: Team = {
        id: teamId || '1',
        name: 'Innovators Team',
        hackathonId: 'hack123',
        hackathonName: 'Global Hackathon 2024',
        description: 'A team of innovative developers',
        techStack: ['React', 'Node.js', 'TypeScript'],
        requiredSkills: ['React', 'Node.js', 'UI/UX'],
        currentMembers: 3,
        maxMembers: 5,
        members: [],
        teamLead: 'Alex Johnson',
        teamLeadId: 'user123',
        teamStatus: 'Active',
        createdAt: new Date('2024-01-15')
      };
      
      // Mock project ideas
      const mockIdeas: ProjectIdea[] = [
        {
          id: '1',
          teamId: teamId || '1',
          title: 'AI Code Review Assistant',
          description: 'An AI-powered tool that automatically reviews code and provides suggestions for improvements, bug fixes, and optimizations.',
          techTags: ['Python', 'Machine Learning', 'NLP'],
          category: 'ai',
          votes: 5,
          createdBy: 'Alex Johnson',
          createdAt: new Date('2024-01-20'),
          comments: [
            {
              id: '101',
              ideaId: '1',
              userId: '1',
              userName: 'Alex Johnson',
              userAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson',
              content: 'I think we should focus on making this work with multiple programming languages from the start.',
              createdAt: new Date('2024-01-21')
            },
            {
              id: '102',
              ideaId: '1',
              userId: '2',
              userName: 'Samantha Lee',
              userAvatar: 'https://ui-avatars.com/api/?name=Samantha+Lee',
              content: 'We could use transformer models to understand code context better.',
              createdAt: new Date('2024-01-22')
            }
          ]
        },
        {
          id: '2',
          teamId: teamId || '1',
          title: 'Developer Productivity Dashboard',
          description: 'A dashboard that tracks and visualizes developer productivity metrics to help teams identify bottlenecks and improve workflow.',
          techTags: ['React', 'TypeScript', 'D3.js'],
          category: 'web',
          votes: 3,
          createdBy: 'Michael Chen',
          createdAt: new Date('2024-01-25'),
          comments: [
            {
              id: '201',
              ideaId: '2',
              userId: '3',
              userName: 'Michael Chen',
              userAvatar: 'https://ui-avatars.com/api/?name=Michael+Chen',
              content: 'We should be careful about privacy concerns with this kind of tracking.',
              createdAt: new Date('2024-01-26')
            }
          ]
        },
        {
          id: '3',
          teamId: teamId || '1',
          title: 'Collaborative Code Editor',
          description: 'A real-time collaborative code editor with integrated AI suggestions and version control.',
          techTags: ['JavaScript', 'WebSockets', 'Monaco Editor'],
          category: 'collaboration',
          votes: 7,
          createdBy: 'Priya Patel',
          createdAt: new Date('2024-01-30'),
          comments: []
        }
      ];
      
      setTeam(mockTeam);
      setIdeas(mockIdeas);
      setLoading(false);
    };
    
    fetchIdeas();
  }, [teamId]);
  
  const handleVote = async (ideaId: string) => {
    const hasVoted = userVotes[ideaId];
    
    if (hasVoted) {
      await removeVote(ideaId);
    } else {
      await voteForIdea(ideaId);
    }
    
    // Update local state
    setIdeas(prev => prev.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          votes: hasVoted ? Math.max(0, idea.votes - 1) : idea.votes + 1
        };
      }
      return idea;
    }));
  };
  
  const handleOpenCommentDialog = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    setShowCommentDialog(true);
  };
  
  const handleSubmitComment = async () => {
    if (!selectedIdeaId || !newComment.trim()) return;
    
    try {
      const comment = await addComment(selectedIdeaId, {
        ideaId: selectedIdeaId,
        userId: user?.id || 'anonymous',
        userName: user?.displayName || 'Anonymous',
        userAvatar: user?.photoURL,
        content: newComment.trim(),
      });
      
      // Update local state
      setIdeas(ideas.map(idea => {
        if (idea.id === selectedIdeaId) {
          return {
            ...idea,
            comments: [comment, ...idea.comments]
          };
        }
        return idea;
      }));
      
      // Reset form
      setNewComment('');
      
      // Close dialog
      setShowCommentDialog(false);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !newIdeaTechTags.includes(newTag.trim())) {
      setNewIdeaTechTags([...newIdeaTechTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setNewIdeaTechTags(newIdeaTechTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmitNewIdea = async () => {
    if (!newIdeaTitle.trim() || !newIdeaDescription.trim() || !newIdeaCategory.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmittingIdea(true);
    
    try {
      const newIdea = await addIdea({
        teamId: teamId || '',
        title: newIdeaTitle.trim(),
        description: newIdeaDescription.trim(),
        category: newIdeaCategory.trim(),
        techTags: newIdeaTechTags,
        createdBy: user?.displayName || 'Anonymous',
      });
      
      // Add to local state
      setIdeas([newIdea, ...ideas]);
      
      // Reset form
      setNewIdeaTitle('');
      setNewIdeaDescription('');
      setNewIdeaCategory('web');
      setNewIdeaTechTags([]);
      
      // Close dialog
      setShowNewIdeaDialog(false);
      
      toast({
        title: "Idea Added",
        description: "Your project idea has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingIdea(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Team Not Found</h2>
                <p className="text-gray-600 mb-6">The team you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate('/find-team')}>
                  Browse Teams
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const selectedIdea = selectedIdeaId ? ideas.find(idea => idea.id === selectedIdeaId) : null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Project Ideas</h1>
              <p className="text-gray-600">{team.name}</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowNewIdeaDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        </div>
        
        {/* Ideas List */}
        {ideas.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-800 mb-2">No Project Ideas Yet</h2>
                <p className="text-gray-600 mb-6">Be the first to share a project idea with your team!</p>
                <Button 
                  onClick={() => setShowNewIdeaDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project Idea
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {ideas
              .sort((a, b) => b.votes - a.votes) // Sort by votes
              .map((idea) => (
                <Card key={idea.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{idea.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Proposed by {idea.createdBy} on {new Date(idea.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">{idea.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{idea.description}</p>
                    
                    {/* Tech Tags */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {idea.techTags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Comments Preview */}
                    {idea.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Recent Comments ({idea.comments.length})
                        </h4>
                        <div className="space-y-3">
                          {idea.comments.slice(0, 2).map((comment) => (
                            <div key={comment.id} className="flex items-start">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{comment.userName}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                          {idea.comments.length > 2 && (
                            <Button 
                              variant="link" 
                              className="text-sm p-0 h-auto"
                              onClick={() => handleOpenCommentDialog(idea.id)}
                            >
                              View all {idea.comments.length} comments
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`flex items-center ${userVotes[idea.id] ? 'text-blue-600' : ''}`}
                        onClick={() => handleVote(idea.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {idea.votes}
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenCommentDialog(idea.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {idea.comments.length > 0 ? `${idea.comments.length} Comments` : 'Add Comment'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        )}
        
        {/* New Idea Dialog */}
        <Dialog open={showNewIdeaDialog} onOpenChange={setShowNewIdeaDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project Idea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title *
                </label>
                <Input
                  id="title"
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  placeholder="Enter a concise title for your idea"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={newIdeaDescription}
                  onChange={(e) => setNewIdeaDescription(e.target.value)}
                  placeholder="Describe your project idea in detail"
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </label>
                <Input
                  id="category"
                  value={newIdeaCategory}
                  onChange={(e) => setNewIdeaCategory(e.target.value)}
                  placeholder="e.g., Developer Tools, Productivity, Education"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newIdeaTechTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a technology"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewIdeaDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitNewIdea}
                disabled={submittingIdea || !newIdeaTitle.trim() || !newIdeaDescription.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {submittingIdea ? 'Submitting...' : 'Submit Idea'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Comment Dialog */}
        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedIdea ? selectedIdea.title : 'Comments'}
              </DialogTitle>
              <DialogDescription>
                {selectedIdea ? `${selectedIdea.comments.length} comments` : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto py-4">
              {selectedIdea && selectedIdea.comments.length > 0 ? (
                <div className="space-y-4">
                  {selectedIdea.comments
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((comment) => (
                      <div key={comment.id} className="flex items-start p-3 rounded-lg bg-gray-50">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                          <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{comment.userName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
            <div className="pt-4 border-t">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                rows={3}
              />
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || addingComment}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {addingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectIdeas;