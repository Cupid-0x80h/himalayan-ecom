-- Enable realtime for cart table
ALTER TABLE public.cart REPLICA IDENTITY FULL;

-- Add the cart table to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart;