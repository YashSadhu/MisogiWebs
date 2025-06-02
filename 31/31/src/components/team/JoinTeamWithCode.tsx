
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTeamStore } from '@/stores/teamStore';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';
import { Users, Check, AlertCircle } from 'lucide-react';

const JoinTeamWithCode = () => {
  const [code, setCode] = useState('');
  const [previewTeam, setPreviewTeam] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { joinTeamWithCode, getTeamByInviteCode, isLoading } = useTeamStore();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();

  const handleCodeChange = async (value: string) => {
    setCode(value);
    setPreviewTeam(null);
    
    // Auto-validate when code reaches expected length
    if (value.length >= 6) {
      setIsValidating(true);
      try {
        const team = await getTeamByInviteCode(value.trim().toUpperCase());
        if (team) {
          setPreviewTeam({
            name: team.name,
            hackathonName: team.hackathonName,
            currentMembers: team.currentMembers,
            maxMembers: team.maxMembers,
            teamLead: team.teamLead
          });
        }
      } catch (error) {
        console.log('Code validation error:', error);
      } finally {
        setIsValidating(false);
      }
    }
  };

  const handleJoinWithCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team code",
        variant: "destructive"
      });
      return;
    }

    try {
      await joinTeamWithCode(code.trim().toUpperCase());
      toast({
        title: "Success!",
        description: `You have joined ${previewTeam?.name || 'the team'} successfully.`,
      });
      addNotification({
        title: "Team Joined",
        message: `You have successfully joined ${previewTeam?.name || 'a team'} using the invite code.`,
        type: "success"
      });
      setCode('');
      setPreviewTeam(null);
    } catch (error: any) {
      const errorMessage = error.message || "Invalid or expired team code";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Join Team with Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter team invite code (e.g., TEAM123ABC)"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
              className="flex-1 font-mono"
              maxLength={12}
            />
            <Button
              onClick={handleJoinWithCode}
              disabled={isLoading || isValidating || !code.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isLoading ? 'Joining...' : 'Join Team'}
            </Button>
          </div>
          
          {/* Code validation feedback */}
          {isValidating && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              Validating code...
            </div>
          )}
          
          {code.length > 0 && !isValidating && !previewTeam && code.length >= 6 && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              Invalid or expired invite code
            </div>
          )}
        </div>

        {/* Team preview */}
        {previewTeam && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">{previewTeam.name}</h4>
                <p className="text-sm text-green-700">{previewTeam.hackathonName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
                  <span>Led by {previewTeam.teamLead}</span>
                  <span>{previewTeam.currentMembers}/{previewTeam.maxMembers} members</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Ask a team member to share their invite code with you</p>
          <p>• Invite codes are case-insensitive and typically 8-12 characters long</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinTeamWithCode;
