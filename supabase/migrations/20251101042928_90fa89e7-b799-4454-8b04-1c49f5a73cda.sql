-- Allow users to update their own orders to cancelled status when order is pending
CREATE POLICY "Users can cancel their pending orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  AND order_status = 'pending'
)
WITH CHECK (
  auth.uid() = user_id 
  AND order_status IN ('pending', 'cancelled')
);