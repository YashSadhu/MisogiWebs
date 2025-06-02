
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseTeamStore } from '@/stores/supabaseTeamStore';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';
import { Users, Check, AlertCircle } from 'lucide-react';

const SupabaseJoinTeamWithCode = () => {
  const [code, setCode] = useState('');
  const { joinTeamWithCode, isLoading } = useSupabaseTeamStore();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();

  const handleJoinWithCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team code",
        variant: "destructive"
      });
      return;
    }

    const success = await joinTeamWithCode(code.trim().toUpperCase());
    
    if (success) {
      toast({
        title: "Success!",
        description: "You have joined the team successfully.",
      });
      addNotification({
        title: "Team Joined",
        message: "You have successfully joined a team using the invite code.",
        type: "success"
      });
      setCode('');
    } else {
      toast({
        title: "Error",
        description: "Invalid or expired team code, or you're already a member",
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
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 font-mono"
              maxLength={12}
            />
            <Button
              onClick={handleJoinWithCode}
              disabled={isLoading || !code.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isLoading ? 'Joining...' : 'Join Team'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>• Ask a team member to share their invite code with you</p>
          <p>• Invite codes are case-insensitive and typically 8-12 characters long</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseJoinTeamWithCode;
