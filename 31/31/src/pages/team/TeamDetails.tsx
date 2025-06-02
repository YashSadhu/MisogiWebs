import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const TeamDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teamId } = useParams();

  useEffect(() => {
    const checkTeamMembership = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user is already a member of any team
      const { data: existingTeam, error } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single();

      if (existingTeam) {
        // Redirect to the existing team page
        navigate(`/team/${existingTeam.team_id}`);
      }
    };

    checkTeamMembership();
  }, [user, navigate]);

  // Simplified header
  const Header = () => (
    <div className="border-b bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => window.history.back()} size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Team Details</h1>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-2">Checking Team Status...</h2>
            <p className="text-gray-600">Please wait while we redirect you to your team.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeamDetails;