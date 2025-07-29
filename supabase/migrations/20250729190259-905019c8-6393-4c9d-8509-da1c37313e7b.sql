
-- Add foreign key constraint between community_messages.user_id and profiles.id
ALTER TABLE public.community_messages 
ADD CONSTRAINT community_messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
