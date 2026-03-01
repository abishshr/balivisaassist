-- Add 'invitation_letter' to the document type check constraint if it exists
-- If the type column is plain text, this migration is a no-op
DO $$
BEGIN
  -- Try to drop and recreate the check constraint with the new value
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name LIKE '%documents_type%'
  ) THEN
    ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_type_check;
    ALTER TABLE public.documents ADD CONSTRAINT documents_type_check
      CHECK (type IN ('passport', 'passport_photo', 'flight_ticket', 'accommodation_proof', 'sponsorship_letter', 'proof_of_payment', 'bank_statement', 'invitation_letter', 'other'));
  END IF;
END $$;
