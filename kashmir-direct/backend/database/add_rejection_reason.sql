-- 1. Add rejection reason to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Add rejection reason to profiles (for seller verification)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 3. Update RLS policies to allow reading these fields
-- (Already handled by previous "Allow All" policies for dev, but good to be explicit if needed)
