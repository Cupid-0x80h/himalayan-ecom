-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add the orders table to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;