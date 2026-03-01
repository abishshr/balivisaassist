-- Add immigration portal fields to customers table
-- These fields are used by the automation script to auto-fill the evisa.imigrasi.go.id portal

ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS place_of_birth text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS indonesia_residence_type text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS indonesia_address text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS indonesia_postal_code text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS indonesia_province text;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS indonesia_city text;
