-- Add Xendit payment fields to payments table

-- New columns for Xendit integration
ALTER TABLE payments ADD COLUMN xendit_invoice_id TEXT;
ALTER TABLE payments ADD COLUMN xendit_payment_url TEXT;
ALTER TABLE payments ADD COLUMN xendit_payment_method TEXT;
ALTER TABLE payments ADD COLUMN xendit_payment_channel TEXT;
ALTER TABLE payments ADD COLUMN xendit_expires_at TIMESTAMPTZ;

-- Index for webhook lookups by xendit_invoice_id
CREATE INDEX idx_payments_xendit_invoice_id ON payments(xendit_invoice_id) WHERE xendit_invoice_id IS NOT NULL;

-- Expand payment_method CHECK to include 'xendit'
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_method_check;
ALTER TABLE payments ADD CONSTRAINT payments_payment_method_check
  CHECK (payment_method IN ('qris', 'cash', 'bank_transfer', 'xendit'));

-- Expand payment_status CHECK to include 'expired'
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_status_check;
ALTER TABLE payments ADD CONSTRAINT payments_payment_status_check
  CHECK (payment_status IN ('pending', 'received', 'verified', 'refunded', 'expired'));

-- RLS policy for service role to insert/update payments (needed for webhook handler)
CREATE POLICY "Service role can manage payments" ON payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
