
-- Update user profile to make them admin of Chandigarh University
UPDATE public.profiles 
SET role = 'admin',
    university_id = (SELECT id FROM universities WHERE name = 'Chandigarh University')
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'pranjalagarwal0702@gmail.com'
);
