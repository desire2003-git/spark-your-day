-- Add content column to motivation_messages table
ALTER TABLE motivation_messages 
ADD COLUMN content TEXT NOT NULL DEFAULT '';

-- Add index for better query performance
CREATE INDEX idx_motivation_messages_created_at ON motivation_messages(created_at DESC);