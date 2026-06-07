-- Kivo Phase 2: Action Log + Daily Digests
-- Run in Supabase SQL Editor after 001_initial_schema.sql

-- 10. Action log table (autopilot execution history)
CREATE TABLE IF NOT EXISTS action_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES autopilot_rules(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  result TEXT,
  status TEXT DEFAULT 'pending',
  executed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE action_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own action log"
  ON action_log FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- 11. Daily digests table
CREATE TABLE IF NOT EXISTS daily_digests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  digest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_revenue NUMERIC DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  avg_ticket NUMERIC DEFAULT 0,
  top_items JSONB DEFAULT '[]',
  alerts_generated INTEGER DEFAULT 0,
  actions_taken INTEGER DEFAULT 0,
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(restaurant_id, digest_date)
);

ALTER TABLE daily_digests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily digests"
  ON daily_digests FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_action_log_restaurant_id ON action_log(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_daily_digests_restaurant_id ON daily_digests(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_daily_digests_date ON daily_digests(digest_date);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);
