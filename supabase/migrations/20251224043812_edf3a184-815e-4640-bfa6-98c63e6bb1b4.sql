-- Fix 1: Add RESTRICTIVE policies to prevent UPDATE/DELETE on achievements table
CREATE POLICY "Prevent achievement modifications"
ON public.achievements FOR UPDATE
USING (false);

CREATE POLICY "Prevent achievement deletions"
ON public.achievements FOR DELETE
USING (false);

-- Fix 2: Add CHECK constraints for input validation on procrastination_chain
-- Using validation trigger instead of CHECK constraints for flexibility

CREATE OR REPLACE FUNCTION public.validate_procrastination_chain_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Validate duration_minutes: must be positive and max 24 hours (1440 minutes)
  IF NEW.duration_minutes <= 0 OR NEW.duration_minutes > 1440 THEN
    RAISE EXCEPTION 'duration_minutes must be between 1 and 1440';
  END IF;
  
  -- Validate activity_type length
  IF length(NEW.activity_type) > 100 THEN
    RAISE EXCEPTION 'activity_type must be 100 characters or less';
  END IF;
  
  -- Validate mood length
  IF length(NEW.mood) > 50 THEN
    RAISE EXCEPTION 'mood must be 50 characters or less';
  END IF;
  
  -- Validate excuse length
  IF length(NEW.excuse) > 500 THEN
    RAISE EXCEPTION 'excuse must be 500 characters or less';
  END IF;
  
  -- Validate custom_label length if provided
  IF NEW.custom_label IS NOT NULL AND length(NEW.custom_label) > 100 THEN
    RAISE EXCEPTION 'custom_label must be 100 characters or less';
  END IF;
  
  -- Validate block_index is non-negative
  IF NEW.block_index < 0 THEN
    RAISE EXCEPTION 'block_index must be non-negative';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_procrastination_chain_input_trigger
BEFORE INSERT ON public.procrastination_chain
FOR EACH ROW
EXECUTE FUNCTION public.validate_procrastination_chain_input();

-- Add similar protection for achievements - prevent UPDATE/DELETE on procrastination_chain too
CREATE POLICY "Prevent chain modifications"
ON public.procrastination_chain FOR UPDATE
USING (false);

CREATE POLICY "Prevent chain deletions"
ON public.procrastination_chain FOR DELETE
USING (false);