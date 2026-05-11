-- ❤️ WISHLIST PERSISTENCE LAYER
-- Enables sovereign identity vault to sync favorite products across portal nodes

CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- RLS (Row Level Security) - Only the owner can manage their wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist items"
ON public.wishlist
FOR ALL
USING (auth.uid() = user_id);

-- Realtime enablement
ALTER PUBLICATION supabase_realtime ADD TABLE wishlist;

-- Index for performance
CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON public.wishlist(user_id);
