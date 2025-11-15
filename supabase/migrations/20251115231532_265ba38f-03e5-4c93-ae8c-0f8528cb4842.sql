-- Create RLS policies for motivation_messages table
-- Allow everyone to read messages
CREATE POLICY "Allow public read access"
ON motivation_messages
FOR SELECT
USING (true);

-- Allow everyone to insert messages
CREATE POLICY "Allow public insert access"
ON motivation_messages
FOR INSERT
WITH CHECK (true);