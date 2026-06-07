-- Kivo Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/nyucjrvwggtsxzqnokmp/sql)

-- 1. Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  plan_id TEXT NOT NULL DEFAULT 'start',
  status TEXT NOT NULL DEFAULT 'trialing',
  interval TEXT DEFAULT 'monthly',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cuisine_type TEXT,
  city TEXT,
  platforms JSONB DEFAULT '[]',
  daily_orders TEXT,
  monthly_revenue NUMERIC,
  avg_ticket NUMERIC,
  team_size TEXT,
  has_delivery_manager BOOLEAN DEFAULT false,
  challenges JSONB DEFAULT '[]',
  onboarding_score INTEGER DEFAULT 0,
  onboarding_plan TEXT DEFAULT 'start',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own restaurant"
  ON restaurants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own restaurant"
  ON restaurants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own restaurant"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC NOT NULL,
  cost NUMERIC DEFAULT 0,
  margin_pct NUMERIC GENERATED ALWAYS AS (
    CASE WHEN price > 0 THEN ROUND(((price - cost) / price * 100)::numeric, 1) ELSE 0 END
  ) STORED,
  orders_count INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  trend_pct NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own menu items"
  ON menu_items FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- 4. Orders table (for tracking)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  external_id TEXT,
  total NUMERIC NOT NULL,
  items JSONB DEFAULT '[]',
  ordered_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- 5. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  sentiment TEXT,
  responded BOOLEAN DEFAULT false,
  response_text TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reviews"
  ON reviews FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- 6. Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT,
  discount_type TEXT,
  discount_value NUMERIC,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  orders_count INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own promotions"
  ON promotions FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- 7. Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alerts"
  ON alerts FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- 8. Autopilot rules table
CREATE TABLE IF NOT EXISTS autopilot_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value JSONB DEFAULT '{}',
  action_type TEXT NOT NULL,
  action_value JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  triggers_count INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE autopilot_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own autopilot rules"
  ON autopilot_rules FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- 9. Chat messages table (for AI assistant history)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat messages"
  ON chat_messages FOR ALL
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_ordered_at ON orders(ordered_at);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_promotions_restaurant_id ON promotions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_restaurant_id ON alerts(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
