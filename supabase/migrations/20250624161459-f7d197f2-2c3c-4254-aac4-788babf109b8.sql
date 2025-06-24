
-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'admin', 'club');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE listing_type AS ENUM ('pg', 'roommate');
CREATE TYPE complaint_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Create universities table
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  university_id UUID REFERENCES universities(id) NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pg_listings table
CREATE TABLE pg_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  university_id UUID REFERENCES universities(id) NOT NULL,
  type listing_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price DECIMAL(10,2),
  contact_phone TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  approval_status approval_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace_items table
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  university_id UUID REFERENCES universities(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  contact_phone TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  approval_status approval_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mess_menus table
CREATE TABLE mess_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  items TEXT NOT NULL,
  week_start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(university_id, day_of_week, meal_type, week_start_date)
);

-- Create club_events table
CREATE TABLE club_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES auth.users(id) NOT NULL,
  university_id UUID REFERENCES universities(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  approval_status approval_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  university_id UUID REFERENCES universities(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('official', 'clubs', 'hostel', 'academics', 'emergency')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  university_id UUID REFERENCES universities(id) NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  tags TEXT[],
  file_url TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  university_id UUID REFERENCES universities(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status complaint_status DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create function to get user's university
CREATE OR REPLACE FUNCTION get_user_university_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT university_id FROM profiles WHERE id = auth.uid();
$$;

-- Create function to get user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in same university" ON profiles
  FOR SELECT USING (university_id = get_user_university_id());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- RLS Policies for pg_listings
CREATE POLICY "Users can view pg listings in same university" ON pg_listings
  FOR SELECT USING (university_id = get_user_university_id() AND (approval_status = 'approved' OR user_id = auth.uid()));

CREATE POLICY "Students can create pg listings" ON pg_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id AND university_id = get_user_university_id());

CREATE POLICY "Users can update own listings" ON pg_listings
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for marketplace_items
CREATE POLICY "Users can view marketplace items in same university" ON marketplace_items
  FOR SELECT USING (university_id = get_user_university_id() AND (approval_status = 'approved' OR user_id = auth.uid()));

CREATE POLICY "Students can create marketplace items" ON marketplace_items
  FOR INSERT WITH CHECK (auth.uid() = user_id AND university_id = get_user_university_id());

CREATE POLICY "Users can update own marketplace items" ON marketplace_items
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for mess_menus
CREATE POLICY "Users can view mess menus in same university" ON mess_menus
  FOR SELECT USING (university_id = get_user_university_id());

CREATE POLICY "Admins can manage mess menus" ON mess_menus
  FOR ALL USING (get_user_role() = 'admin' AND university_id = get_user_university_id());

-- RLS Policies for club_events
CREATE POLICY "Users can view approved club events in same university" ON club_events
  FOR SELECT USING (university_id = get_user_university_id() AND (approval_status = 'approved' OR club_id = auth.uid()));

CREATE POLICY "Clubs can create events" ON club_events
  FOR INSERT WITH CHECK (auth.uid() = club_id AND university_id = get_user_university_id());

CREATE POLICY "Clubs can update own events" ON club_events
  FOR UPDATE USING (club_id = auth.uid());

-- RLS Policies for announcements
CREATE POLICY "Users can view announcements in same university" ON announcements
  FOR SELECT USING (university_id = get_user_university_id());

CREATE POLICY "Admins and clubs can create announcements" ON announcements
  FOR INSERT WITH CHECK (auth.uid() = user_id AND university_id = get_user_university_id() AND get_user_role() IN ('admin', 'club'));

-- RLS Policies for notes
CREATE POLICY "Users can view notes in same university" ON notes
  FOR SELECT USING (university_id = get_user_university_id());

CREATE POLICY "Students can create notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id AND university_id = get_user_university_id());

CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for complaints
CREATE POLICY "Users can view own complaints" ON complaints
  FOR SELECT USING (user_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Students can create complaints" ON complaints
  FOR INSERT WITH CHECK (auth.uid() = user_id AND university_id = get_user_university_id());

CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE USING (get_user_role() = 'admin' AND university_id = get_user_university_id());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role, university_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    (NEW.raw_user_meta_data->>'university_id')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample universities
INSERT INTO universities (name, code) VALUES 
  ('Chandigarh University', 'CU'),
  ('Delhi University', 'DU'),
  ('Mumbai University', 'MU');
