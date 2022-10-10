-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE OR REPLACE VIEW public.random_greeters
 AS
 SELECT greeters.id,
    greeters.message,
    greeters.created_at,
    greeters.updated_at
   FROM greeters
  ORDER BY (random());

ALTER TABLE public.random_greeters
    OWNER TO postgres;

GRANT ALL ON TABLE public.random_greeters TO authenticated;
GRANT ALL ON TABLE public.random_greeters TO postgres;
GRANT ALL ON TABLE public.random_greeters TO anon;
GRANT ALL ON TABLE public.random_greeters TO service_role;