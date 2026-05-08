-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'buyer',
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sellers table
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  shop_name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  whatsapp_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES sellers(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  unit TEXT DEFAULT 'kg',
  category TEXT,
  location TEXT,
  images TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  whatsapp_number TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin permissions table
CREATE TABLE admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  can_verify_sellers BOOLEAN DEFAULT true,
  can_delete_products BOOLEAN DEFAULT true,
  can_ban_users BOOLEAN DEFAULT false,
  can_manage_categories BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_id TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Saffron', 'saffron', '🌸'),
  ('Apples', 'apples', '🍎'),
  ('Walnuts', 'walnuts', '🌰'),
  ('Dry Fruits', 'dry-fruits', '🥜'),
  ('Pashmina', 'pashmina', '🧣'),
  ('Handicrafts', 'handicrafts', '🏺'),
  ('Carpets', 'carpets', '🪴'),
  ('Honey', 'honey', '🍯'),
  ('Wood Craft', 'wood-craft', '🪵'),
  ('Spices', 'spices', '🌿');
