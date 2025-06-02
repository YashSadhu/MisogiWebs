import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, File, Folder, Download, Trash2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: string;
  downloadUrl: string;
  sharedWith: {
    id: string;
    name: string;
  }[];
}

interface FileSharingProps {
  teamId: string;
  onUploadFile: (file: File) => Promise<string>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onShareFile: (fileId: string, userIds: string[]) => Promise<void>;
  onDownloadFile: (fileId: string) => Promise<void>;
}

const FileSharing = ({
  teamId,
  onUploadFile,
  onDeleteFile,
  onShareFile,
  onDownloadFile,
}: FileSharingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        try {
          setIsLoading(true);
          setUploadProgress(0);
          const fileUrl = await onUploadFile(file);
          setUploadProgress(100);
          toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onUploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // Sample data
  const [files] = useState<SharedFile[]>([
    {
      id: '1',
      name: 'Project Proposal.pdf',
      type: 'application/pdf',
      size: 1024 * 1024 * 2.5, // 2.5MB
      uploadedBy: {
        id: '1',
        name: 'John Doe',
      },
      uploadedAt: '2024-03-10T10:00:00Z',
      downloadUrl: '/files/proposal.pdf',
      sharedWith: [
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Bob Johnson' },
      ],
    },
    {
      id: '2',
      name: 'Design Assets.zip',
      type: 'application/zip',
      size: 1024 * 1024 * 15, // 15MB
      uploadedBy: {
        id: '2',
        name: 'Jane Smith',
      },
      uploadedAt: '2024-03-11T14:30:00Z',
      downloadUrl: '/files/assets.zip',
      sharedWith: [
        { id: '1', name: 'John Doe' },
        { id: '3', name: 'Bob Johnson' },
      ],
    },
  ]);

  const handleDeleteFile = async (fileId: string) => {
    try {
      setIsLoading(true);
      await onDeleteFile(fileId);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      setIsLoading(true);
      await onDownloadFile(fileId);
      toast.success('File download started');
    } catch (error) {
      toast.error('Failed to download file');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <File className="h-6 w-6 text-blue-500" />;
    } else if (type === 'application/pdf') {
      return <File className="h-6 w-6 text-red-500" />;
    } else if (type === 'application/zip') {
      return <Folder className="h-6 w-6 text-yellow-500" />;
    }
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || file.type.startsWith(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>File Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag and drop files here, or click to select files'}
            </p>
            {isLoading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="image/">Images</option>
                <option value="application/pdf">PDFs</option>
                <option value="application/zip">Archives</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • Uploaded by {file.uploadedBy.name} on{' '}
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {file.sharedWith.map((user) => (
                            <Badge key={user.id} variant="secondary">
                              {user.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(file.id)}
                        disabled={isLoading}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShareFile(file.id, [])}
                        disabled={isLoading}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default FileSharing; 