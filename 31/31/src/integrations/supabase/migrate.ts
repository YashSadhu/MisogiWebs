import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghzlurxensmtqakysqtf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoemx1cnhlbnNtdHFha3lzcXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTgwNzUsImV4cCI6MjA2NDE3NDA3NX0.csh4hJe77GU0BA8IGfM5nFIPorYzyz5PBr50dJ4PLyc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    // Add foreign key relationship between teams and profiles for leader_id
    const { error: teamsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE teams
        ADD CONSTRAINT teams_leader_id_fkey
        FOREIGN KEY (leader_id)
        REFERENCES profiles(id)
        ON DELETE SET NULL;
      `
    });

    if (teamsError) {
      console.error('Error adding teams foreign key:', teamsError);
      return;
    }

    // Add foreign key relationship between team_members and profiles
    const { error: membersError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE team_members
        ADD CONSTRAINT team_members_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE;
      `
    });

    if (membersError) {
      console.error('Error adding team_members foreign key:', membersError);
      return;
    }

    // Add foreign key relationship between team_join_requests and profiles
    const { error: requestsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE team_join_requests
        ADD CONSTRAINT team_join_requests_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE;
      `
    });

    if (requestsError) {
      console.error('Error adding team_join_requests foreign key:', requestsError);
      return;
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration(); 