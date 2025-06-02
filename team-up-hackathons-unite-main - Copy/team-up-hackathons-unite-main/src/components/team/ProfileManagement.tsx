import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, X, Star, Link, Award, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  image?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ProfileManagementProps {
  userId: string;
  onUpdateProfile: (data: any) => Promise<void>;
  onAddSkill: (skill: Skill) => Promise<void>;
  onRemoveSkill: (skillName: string) => Promise<void>;
  onAddProject: (project: Omit<Project, 'id'>) => Promise<void>;
  onAddExperience: (experience: Omit<Experience, 'id'>) => Promise<void>;
}

const ProfileManagement = ({
  userId,
  onUpdateProfile,
  onAddSkill,
  onRemoveSkill,
  onAddProject,
  onAddExperience,
}: ProfileManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');
  const [newSkill, setNewSkill] = useState<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience: number;
  }>({
    name: '',
    level: 'beginner',
    yearsOfExperience: 0,
  });
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    link: '',
    image: '',
  });
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [techInput, setTechInput] = useState('');

  // Sample data
  const [skills] = useState<Skill[]>([
    { name: 'React', level: 'advanced', yearsOfExperience: 3 },
    { name: 'TypeScript', level: 'intermediate', yearsOfExperience: 2 },
    { name: 'Node.js', level: 'advanced', yearsOfExperience: 4 },
  ]);

  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform with real-time inventory management.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      link: 'https://github.com/username/project',
    },
  ]);

  const [experiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      startDate: '2020-01',
      endDate: '2023-12',
      description: 'Led frontend development for enterprise applications.',
    },
  ]);

  const handleAddSkill = async () => {
    if (!newSkill.name) {
      toast.error('Please enter a skill name');
      return;
    }

    try {
      setIsLoading(true);
      await onAddSkill(newSkill);
      setNewSkill({ name: '', level: 'beginner', yearsOfExperience: 0 });
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error('Failed to add skill');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.link) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await onAddProject(newProject);
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        link: '',
        image: '',
      });
      toast.success('Project added successfully');
    } catch (error) {
      toast.error('Failed to add project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await onAddExperience(newExperience);
      setNewExperience({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      });
      toast.success('Experience added successfully');
    } catch (error) {
      toast.error('Failed to add experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTechnology = () => {
    if (techInput.trim() && !newProject.technologies.includes(techInput.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const getSkillLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-500';
      case 'advanced':
        return 'bg-blue-500';
      case 'intermediate':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="skills">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Add New Skill</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  />
                  <Select
                    value={newSkill.level}
                    onValueChange={(value: Skill['level']) =>
                      setNewSkill({ ...newSkill, level: value })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Years"
                    value={newSkill.yearsOfExperience}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) })
                    }
                    className="w-[100px]"
                  />
                  <Button onClick={handleAddSkill} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Your Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="outline">{skill.yearsOfExperience} years</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveSkill(skill.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Level:</span>
                          <Badge className={getSkillLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                        </div>
                        <Progress
                          value={
                            skill.level === 'expert'
                              ? 100
                              : skill.level === 'advanced'
                              ? 75
                              : skill.level === 'intermediate'
                              ? 50
                              : 25
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Add New Project</h3>
                <Input
                  placeholder="Project title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
                <Textarea
                  placeholder="Project description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                  />
                  <Button variant="outline" onClick={handleAddTechnology}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                      <button
                        className="ml-1"
                        onClick={() =>
                          setNewProject({
                            ...newProject,
                            technologies: newProject.technologies.filter((t) => t !== tech),
                          })
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Project link"
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                />
                <Button onClick={handleAddProject} disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Project'}
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Your Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <Link className="h-4 w-4" />
                        View Project
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experience">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Add New Experience</h3>
                <Input
                  placeholder="Job title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="month"
                    placeholder="Start date"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                  />
                  <Input
                    type="month"
                    placeholder="End date"
                    value={newExperience.endDate}
                    onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Job description"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                />
                <Button onClick={handleAddExperience} disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Experience'}
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Your Experience</h3>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-gray-500">{exp.company}</p>
                        </div>
                        <Badge variant="outline">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileManagement; 