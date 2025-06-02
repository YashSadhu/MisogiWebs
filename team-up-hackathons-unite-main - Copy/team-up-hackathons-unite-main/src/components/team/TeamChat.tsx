import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, File, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'task';
  file?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  task?: {
    title: string;
    assignee: string;
    dueDate: Date;
    status: 'pending' | 'in-progress' | 'completed';
  };
}

interface TeamChatProps {
  teamId: string;
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  onFileUpload: (file: File) => Promise<string>;
  onTaskCreate: (task: Message['task']) => Promise<void>;
}

const TeamChat = ({ teamId, currentUser, onSendMessage, onFileUpload, onTaskCreate }: TeamChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    assignee: '',
    dueDate: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulated message loading
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages([
          {
            id: '1',
            sender: {
              id: '1',
              name: 'John Doe',
              avatar: 'https://github.com/shadcn.png',
            },
            content: 'Welcome to the team chat!',
            timestamp: new Date(),
            type: 'text',
          },
          {
            id: '2',
            sender: {
              id: '2',
              name: 'Jane Smith',
              avatar: 'https://github.com/shadcn.png',
            },
            content: "I've uploaded the project requirements document.",
            timestamp: new Date(),
            type: 'file',
            file: {
              name: 'requirements.pdf',
              size: 1024 * 1024,
              type: 'application/pdf',
              url: '#',
            },
          },
        ]);
      } catch (error) {
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [teamId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      setIsLoading(true);
      let messageContent = newMessage;
      let messageType: Message['type'] = 'text';
      let fileData;

      if (selectedFile) {
        const fileUrl = await onFileUpload(selectedFile);
        fileData = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          url: fileUrl,
        };
        messageType = 'file';
        messageContent = `Shared file: ${selectedFile.name}`;
      }

      await onSendMessage({
        sender: currentUser,
        content: messageContent,
        type: messageType,
        file: fileData,
      });

      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.info(`Selected file: ${file.name}`);
    }
  };

  const handleTaskSubmit = async () => {
    if (!taskForm.title || !taskForm.assignee || !taskForm.dueDate) {
      toast.error('Please fill in all task details');
      return;
    }

    try {
      setIsLoading(true);
      await onTaskCreate({
        title: taskForm.title,
        assignee: taskForm.assignee,
        dueDate: new Date(taskForm.dueDate),
        status: 'pending',
      });

      setTaskForm({
        title: '',
        assignee: '',
        dueDate: '',
      });
      setActiveTab('chat');
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ScrollArea ref={scrollRef} className="h-[400px] pr-4">
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.sender.id === currentUser.id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col ${
                          message.sender.id === currentUser.id ? 'items-end' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{message.sender.name}</span>
                          <span className="text-xs text-gray-500">
                            {format(message.timestamp, 'HH:mm')}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender.id === currentUser.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          {message.type === 'file' && message.file && (
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4" />
                              <a
                                href={message.file.url}
                                className="underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {message.file.name}
                              </a>
                            </div>
                          )}
                          {message.type === 'task' && message.task && (
                            <div className="space-y-2">
                              <div className="font-medium">{message.task.title}</div>
                              <div className="text-sm">
                                Assigned to: {message.task.assignee}
                              </div>
                              <div className="text-sm">
                                Due: {format(message.task.dueDate, 'PPP')}
                              </div>
                              <Badge
                                variant={
                                  message.task.status === 'completed'
                                    ? 'default'
                                    : message.task.status === 'in-progress'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {message.task.status}
                              </Badge>
                            </div>
                          )}
                          {message.type === 'text' && <p>{message.content}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="mt-4 space-y-2">
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <File className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!newMessage.trim() && !selectedFile)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Task title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
                <Input
                  placeholder="Assign to"
                  value={taskForm.assignee}
                  onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                />
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
                <Button
                  onClick={handleTaskSubmit}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Create Task'
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Recent Tasks</h3>
                {messages
                  .filter((m) => m.type === 'task')
                  .map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{message.task?.title}</p>
                        <p className="text-sm text-gray-500">
                          Due: {format(message.task?.dueDate || new Date(), 'PPP')}
                        </p>
                      </div>
                      <Badge
                        variant={
                          message.task?.status === 'completed'
                            ? 'default'
                            : message.task?.status === 'in-progress'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {message.task?.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <File className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Shared Files</h3>
                {messages
                  .filter((m) => m.type === 'file')
                  .map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{message.file?.name}</p>
                          <p className="text-sm text-gray-500">
                            Shared by {message.sender.name}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamChat; 