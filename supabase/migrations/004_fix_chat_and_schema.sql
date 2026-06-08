-- Add missing columns to chat_messages
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'app';

-- Make user_id optional (for WhatsApp messages)
ALTER TABLE chat_messages ALTER COLUMN user_id DROP NOT NULL;

-- Add severity and metadata to alerts if missing
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info';
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add external_id and platform to orders if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Add external_id to reviews if missing
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Add external_id and platform to menu_items if missing
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add whatsapp_phone to restaurants
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;

-- Add description to promotions
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS description TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_restaurant ON chat_messages(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_external_id ON orders(external_id);
CREATE INDEX IF NOT EXISTS idx_reviews_external_id ON reviews(external_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_external_id ON menu_items(external_id);

-- Unique constraints for upserts
DO $$ BEGIN
  ALTER TABLE orders ADD CONSTRAINT orders_restaurant_external_unique UNIQUE (restaurant_id, external_id);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE reviews ADD CONSTRAINT reviews_restaurant_external_unique UNIQUE (restaurant_id, external_id);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE menu_items ADD CONSTRAINT menu_items_restaurant_external_unique UNIQUE (restaurant_id, external_id);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;
