-- Sectors table
CREATE TABLE sectors (
  id INT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Profiles table (users linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  sector_id INT REFERENCES sectors(id)
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  client TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INT NOT NULL,
  sector_id INT REFERENCES sectors(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'terminated')),
  position INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for queue ordering
CREATE INDEX idx_orders_sector_position ON orders (sector_id, position);

-- CRITICAL: Only one active order per sector
CREATE UNIQUE INDEX one_active_order_per_sector
ON orders (sector_id)
WHERE status = 'active';

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS: authenticated users can only read/write orders from their assigned sector.
-- WITH CHECK is required for INSERT and prevents inserts into another sector.
CREATE POLICY "Users can access orders in their sector"
ON orders
FOR ALL
TO authenticated
USING (sector_id = (SELECT sector_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (sector_id = (SELECT sector_id FROM profiles WHERE id = auth.uid()));

-- The import screen always creates orders in Sector 1. This permits that exact
-- insert for logged-in users even before a profile has been assigned.
CREATE POLICY "Authenticated users can import Sector 1 orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (sector_id = 1);

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;

-- Seed sectors
INSERT INTO sectors (id, name) VALUES
  (1, 'Sector 1'),
  (2, 'Sector 2'),
  (3, 'Sector 3'),
  (4, 'Sector 4'),
  (5, 'Sector 5'),
  (6, 'Sector 6');
