-- Add category column to payments table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'payments'
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.payments ADD COLUMN category text;
    END IF;
END $$;
