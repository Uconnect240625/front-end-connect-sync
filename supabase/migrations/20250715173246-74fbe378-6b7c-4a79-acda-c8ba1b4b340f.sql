-- Modify marketplace_items table to support multiple images
ALTER TABLE marketplace_items 
DROP COLUMN image_url;

ALTER TABLE marketplace_items 
ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- Update any existing records to use the new column format
-- (This is safe since we're just adding a new column)