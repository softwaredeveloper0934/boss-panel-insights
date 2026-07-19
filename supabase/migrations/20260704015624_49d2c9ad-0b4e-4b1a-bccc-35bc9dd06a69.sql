
CREATE TABLE public.follow_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_key TEXT NOT NULL DEFAULT 'default',
  lead_name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('Email','SMS','Call')),
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX follow_ups_workspace_due_idx ON public.follow_ups (workspace_key, due_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.follow_ups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.follow_ups TO authenticated;
GRANT ALL ON public.follow_ups TO service_role;

ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follow_ups" ON public.follow_ups FOR SELECT USING (true);
CREATE POLICY "Anyone can insert follow_ups" ON public.follow_ups FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update follow_ups" ON public.follow_ups FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete follow_ups" ON public.follow_ups FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER follow_ups_set_updated_at BEFORE UPDATE ON public.follow_ups
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
