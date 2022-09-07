-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.greeters
(
    id bigint NOT NULL,
    message character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    CONSTRAINT greeters_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.greeters
    OWNER to postgres;

GRANT ALL ON TABLE public.greeters TO anon;

GRANT ALL ON TABLE public.greeters TO authenticated;

GRANT ALL ON TABLE public.greeters TO postgres;

GRANT ALL ON TABLE public.greeters TO service_role;
