import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2, Plus, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    id: string;
    name: string;
  };
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
}

interface TaskManagementProps {
  teamId: string;
  onAddTask: (task: Omit<Task, 'id'>) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
  onUpdateTaskProgress: (taskId: string, progress: number) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const TaskManagement = ({
  teamId,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
  onDeleteTask,
}: TaskManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');

  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    assignee: {
      id: '',
      name: '',
    },
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    progress: 0,
  });

  // Sample data
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Set up JWT authentication and user registration',
      assignee: {
        id: '1',
        name: 'John Doe',
      },
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-03-15',
      progress: 60,
    },
    {
      id: '2',
      title: 'Design database schema',
      description: 'Create ERD and implement database tables',
      assignee: {
        id: '2',
        name: 'Jane Smith',
      },
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-03-10',
      progress: 100,
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all API endpoints and request/response formats',
      assignee: {
        id: '3',
        name: 'Bob Johnson',
      },
      status: 'todo',
      priority: 'low',
      dueDate: '2024-03-20',
      progress: 0,
    },
  ]);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.assignee.id || !newTask.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await onAddTask(newTask);
      setNewTask({
        title: '',
        description: '',
        assignee: {
          id: '',
          name: '',
        },
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        progress: 0,
      });
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      setIsLoading(true);
      await onUpdateTaskStatus(taskId, status);
      toast.success('Task status updated successfully');
    } catch (error) {
      toast.error('Failed to update task status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressChange = async (taskId: string, progress: number) => {
    try {
      setIsLoading(true);
      await onUpdateTaskProgress(taskId, progress);
      toast.success('Task progress updated successfully');
    } catch (error) {
      toast.error('Failed to update task progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await onDeleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Add New Task</h3>
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newTask.priority}
                onValueChange={(value: Task['priority']) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <Button onClick={handleAddTask} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Task'}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={statusFilter}
                onValueChange={(value: Task['status'] | 'all') => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={priorityFilter}
                onValueChange={(value: Task['priority'] | 'all') => setPriorityFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Assigned to: {task.assignee.name}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progress:</span>
                        <span className="text-sm">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={task.status}
                        onValueChange={(value: Task['status']) => handleStatusChange(task.id, value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={task.progress}
                        onChange={(e) =>
                          handleProgressChange(task.id, parseInt(e.target.value))
                        }
                        className="w-[100px]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskManagement; 