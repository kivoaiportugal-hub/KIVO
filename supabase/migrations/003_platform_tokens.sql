-- Platform tokens storage
CREATE TABLE IF NOT EXISTS platform_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  token_type TEXT DEFAULT 'Bearer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(restaurant_id, platform)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_platform_tokens_restaurant ON platform_tokens(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_platform_tokens_platform ON platform_tokens(platform);

-- RLS
ALTER TABLE platform_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own platform tokens"
  ON platform_tokens FOR SELECT
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own platform tokens"
  ON platform_tokens FOR INSERT
  WITH CHECK (restaurant_id IN (
    SELECT id FROM restaurants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own platform tokens"
  ON platform_tokens FOR UPDATE
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own platform tokens"
  ON platform_tokens FOR DELETE
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE user_id = auth.uid()
  ));
