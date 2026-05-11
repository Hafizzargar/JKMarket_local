-- 🛡️ IDENTITY GOVERNANCE SCHEMA UPDATE
-- Run this in your Supabase SQL Editor to enable account suspension.

-- 1. Add status column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'banned'));

-- 2. Ensure the admin has permissions to update profiles
-- (Assuming RLS is enabled, you might need a policy for super-admins)
CREATE POLICY "Super Admins can update any profile status" 
ON public.profiles
FOR UPDATE 
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin'
);

-- 3. Add a comment for documentation
COMMENT ON COLUMN public.profiles.status IS 'Account state: active allows login, banned blocks access via AuthGuard.';
