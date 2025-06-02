import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTeamStore } from '@/stores/teamStore';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';

const JoinTeamWithCode = () => {
  const [code, setCode] = useState('');
  const { joinTeamWithCode, isLoading } = useTeamStore();
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

    try {
      await joinTeamWithCode(code.trim());
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid or expired team code",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Join Team with Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Enter team code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleJoinWithCode}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isLoading ? 'Joining...' : 'Join Team'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinTeamWithCode; 