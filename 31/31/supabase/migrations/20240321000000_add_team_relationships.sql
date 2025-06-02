-- Add foreign key relationship between teams and profiles for leader_id
ALTER TABLE teams
ADD CONSTRAINT teams_leader_id_fkey
FOREIGN KEY (leader_id)
REFERENCES profiles(id)
ON DELETE SET NULL;

-- Add foreign key relationship between team_members and profiles
ALTER TABLE team_members
ADD CONSTRAINT team_members_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Add foreign key relationship between team_join_requests and profiles
ALTER TABLE team_join_requests
ADD CONSTRAINT team_join_requests_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE; 