
-- Enable RLS on universities table if not already enabled
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Allow public read access to universities (needed for signup form)
CREATE POLICY "Anyone can view universities" ON universities
  FOR SELECT USING (true);

-- Allow admins to manage universities
CREATE POLICY "Admins can manage universities" ON universities
  FOR ALL USING (get_user_role() = 'admin');
