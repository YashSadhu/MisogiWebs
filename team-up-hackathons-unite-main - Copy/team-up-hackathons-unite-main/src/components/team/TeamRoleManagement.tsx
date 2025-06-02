import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, X, Shield, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  permissions: {
    canInvite: boolean;
    canRemove: boolean;
    canEdit: boolean;
    canView: boolean;
  };
}

interface TeamRoleManagementProps {
  teamId: string;
  onUpdateMemberRole: (memberId: string, role: TeamMember['role']) => Promise<void>;
  onUpdateMemberPermissions: (memberId: string, permissions: TeamMember['permissions']) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
}

const TeamRoleManagement = ({
  teamId,
  onUpdateMemberRole,
  onUpdateMemberPermissions,
  onRemoveMember,
}: TeamRoleManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const [members] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      permissions: {
        canInvite: true,
        canRemove: true,
        canEdit: true,
        canView: true,
      },
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'member',
      permissions: {
        canInvite: true,
        canRemove: false,
        canEdit: true,
        canView: true,
      },
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'viewer',
      permissions: {
        canInvite: false,
        canRemove: false,
        canEdit: false,
        canView: true,
      },
    },
  ]);

  const handleRoleChange = async (memberId: string, newRole: TeamMember['role']) => {
    try {
      setIsLoading(true);
      await onUpdateMemberRole(memberId, newRole);
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = async (
    memberId: string,
    permission: keyof TeamMember['permissions'],
    value: boolean
  ) => {
    try {
      setIsLoading(true);
      const member = members.find((m) => m.id === memberId);
      if (member) {
        await onUpdateMemberPermissions(memberId, {
          ...member.permissions,
          [permission]: value,
        });
        toast.success('Permissions updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      await onRemoveMember(memberId);
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'member':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Role Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" className="ml-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={isLoading}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-24">Role:</span>
                    <Select
                      value={member.role}
                      onValueChange={(value: TeamMember['role']) => handleRoleChange(member.id, value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Permissions:</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Can Invite</span>
                        <Switch
                          checked={member.permissions.canInvite}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(member.id, 'canInvite', checked)
                          }
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Can Remove</span>
                        <Switch
                          checked={member.permissions.canRemove}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(member.id, 'canRemove', checked)
                          }
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Can Edit</span>
                        <Switch
                          checked={member.permissions.canEdit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(member.id, 'canEdit', checked)
                          }
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Can View</span>
                        <Switch
                          checked={member.permissions.canView}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(member.id, 'canView', checked)
                          }
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamRoleManagement; 