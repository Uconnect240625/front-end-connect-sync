
-- Update the check constraint on announcements table to allow 'club' type
ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_type_check;
ALTER TABLE public.announcements ADD CONSTRAINT announcements_type_check CHECK (type IN ('official', 'club'));
