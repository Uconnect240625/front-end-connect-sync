
-- Add file_url column to complaints table to store the uploaded file URL
ALTER TABLE public.complaints 
ADD COLUMN file_url text;
