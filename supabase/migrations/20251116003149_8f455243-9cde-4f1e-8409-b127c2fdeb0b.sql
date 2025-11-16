-- Add user_id column to motivation_messages for user ownership
ALTER TABLE motivation_messages
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX idx_motivation_messages_user_id ON motivation_messages(user_id);

-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public read access" ON motivation_messages;
DROP POLICY IF EXISTS "Allow public insert access" ON motivation_messages;

-- Create user-scoped RLS policies
CREATE POLICY "Users can read own messages"
ON motivation_messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
ON motivation_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
ON motivation_messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);