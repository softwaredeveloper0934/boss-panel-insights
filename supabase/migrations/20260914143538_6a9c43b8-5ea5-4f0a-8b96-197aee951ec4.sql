CREATE TABLE public.influencers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  handle TEXT NOT NULL,
  email TEXT,
  country TEXT,
  platform TEXT,
  tier TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}',
  categories TEXT[] NOT NULL DEFAULT '{}',
  followers BIGINT NOT NULL DEFAULT 0,
  engagement_rate NUMERIC(6,2) NOT NULL DEFAULT 0,
  revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  commission NUMERIC(14,2) NOT NULL DEFAULT 0,
  health_score INTEGER NOT NULL DEFAULT 0,
  risk_score INTEGER NOT NULL DEFAULT 0,
  verification TEXT NOT NULL DEFAULT 'unverified' CHECK (verification IN ('unverified','pending','verified','rejected')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX influencers_status_idx ON public.influencers (status);
CREATE INDEX influencers_created_at_idx ON public.influencers (created_at DESC);
CREATE UNIQUE INDEX influencers_handle_key ON public.influencers (lower(handle));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.influencers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.influencers TO authenticated;
GRANT ALL ON public.influencers TO service_role;

ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view influencers" ON public.influencers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert influencers" ON public.influencers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update influencers" ON public.influencers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete influencers" ON public.influencers FOR DELETE USING (true);

CREATE TRIGGER influencers_set_updated_at BEFORE UPDATE ON public.influencers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();