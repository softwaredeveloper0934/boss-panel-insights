
-- brands
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  contact_email text,
  industry text,
  country text,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO anon, authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Anyone can insert brands" ON public.brands FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update brands" ON public.brands FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete brands" ON public.brands FOR DELETE USING (true);
CREATE TRIGGER brands_set_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- campaigns
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  brand_name text,
  objective text NOT NULL DEFAULT 'awareness',
  budget numeric(14,2) NOT NULL DEFAULT 0,
  spent numeric(14,2) NOT NULL DEFAULT 0,
  start_date date,
  end_date date,
  approval text NOT NULL DEFAULT 'pending',
  status text NOT NULL DEFAULT 'draft',
  brief text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO anon, authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Anyone can insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update campaigns" ON public.campaigns FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete campaigns" ON public.campaigns FOR DELETE USING (true);
CREATE TRIGGER campaigns_set_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX campaigns_status_idx ON public.campaigns (status);

-- campaign_creators
CREATE TABLE public.campaign_creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  influencer_id uuid NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'assigned',
  fee numeric(14,2) NOT NULL DEFAULT 0,
  deliverables text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, influencer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_creators TO anon, authenticated;
GRANT ALL ON public.campaign_creators TO service_role;
ALTER TABLE public.campaign_creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view campaign_creators" ON public.campaign_creators FOR SELECT USING (true);
CREATE POLICY "Anyone can insert campaign_creators" ON public.campaign_creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update campaign_creators" ON public.campaign_creators FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete campaign_creators" ON public.campaign_creators FOR DELETE USING (true);
CREATE TRIGGER campaign_creators_set_updated_at BEFORE UPDATE ON public.campaign_creators FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  handle text NOT NULL,
  email text,
  country text,
  platform text,
  followers bigint NOT NULL DEFAULT 0,
  categories text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'direct',
  stage text NOT NULL DEFAULT 'submitted',
  risk_score integer NOT NULL DEFAULT 0,
  reviewer text,
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update applications" ON public.applications FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete applications" ON public.applications FOR DELETE USING (true);
CREATE TRIGGER applications_set_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX applications_stage_idx ON public.applications (stage);

-- collaborations
CREATE TABLE public.collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  influencer_id uuid REFERENCES public.influencers(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'sponsored_post',
  value numeric(14,2) NOT NULL DEFAULT 0,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'proposed',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collaborations TO anon, authenticated;
GRANT ALL ON public.collaborations TO service_role;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view collaborations" ON public.collaborations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert collaborations" ON public.collaborations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update collaborations" ON public.collaborations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete collaborations" ON public.collaborations FOR DELETE USING (true);
CREATE TRIGGER collaborations_set_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- social_accounts
CREATE TABLE public.social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES public.influencers(id) ON DELETE CASCADE,
  platform text NOT NULL,
  handle text NOT NULL,
  profile_url text,
  followers bigint NOT NULL DEFAULT 0,
  engagement_rate numeric(6,2) NOT NULL DEFAULT 0,
  verification text NOT NULL DEFAULT 'unverified',
  status text NOT NULL DEFAULT 'connected',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_accounts TO anon, authenticated;
GRANT ALL ON public.social_accounts TO service_role;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view social_accounts" ON public.social_accounts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert social_accounts" ON public.social_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update social_accounts" ON public.social_accounts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete social_accounts" ON public.social_accounts FOR DELETE USING (true);
CREATE TRIGGER social_accounts_set_updated_at BEFORE UPDATE ON public.social_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- content_items
CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  influencer_id uuid REFERENCES public.influencers(id) ON DELETE SET NULL,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'post',
  platform text,
  asset_url text,
  scheduled_at timestamptz,
  published_at timestamptz,
  approval text NOT NULL DEFAULT 'pending',
  status text NOT NULL DEFAULT 'draft',
  views bigint NOT NULL DEFAULT 0,
  likes bigint NOT NULL DEFAULT 0,
  comments bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO anon, authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view content_items" ON public.content_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert content_items" ON public.content_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update content_items" ON public.content_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete content_items" ON public.content_items FOR DELETE USING (true);
CREATE TRIGGER content_items_set_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- payouts
CREATE TABLE public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES public.influencers(id) ON DELETE SET NULL,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  method text NOT NULL DEFAULT 'bank_transfer',
  period text,
  reference text,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payouts TO anon, authenticated;
GRANT ALL ON public.payouts TO service_role;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view payouts" ON public.payouts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert payouts" ON public.payouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update payouts" ON public.payouts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete payouts" ON public.payouts FOR DELETE USING (true);
CREATE TRIGGER payouts_set_updated_at BEFORE UPDATE ON public.payouts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- wallet_transactions
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES public.influencers(id) ON DELETE SET NULL,
  direction text NOT NULL DEFAULT 'credit',
  amount numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  category text NOT NULL DEFAULT 'commission',
  reference text,
  description text,
  status text NOT NULL DEFAULT 'posted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wallet_transactions TO anon, authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view wallet_transactions" ON public.wallet_transactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert wallet_transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update wallet_transactions" ON public.wallet_transactions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete wallet_transactions" ON public.wallet_transactions FOR DELETE USING (true);
CREATE TRIGGER wallet_transactions_set_updated_at BEFORE UPDATE ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- rewards
CREATE TABLE public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES public.influencers(id) ON DELETE SET NULL,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'reward',
  points integer NOT NULL DEFAULT 0,
  value numeric(14,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'granted',
  awarded_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rewards TO anon, authenticated;
GRANT ALL ON public.rewards TO service_role;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rewards" ON public.rewards FOR SELECT USING (true);
CREATE POLICY "Anyone can insert rewards" ON public.rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rewards" ON public.rewards FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete rewards" ON public.rewards FOR DELETE USING (true);
CREATE TRIGGER rewards_set_updated_at BEFORE UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- verification_requests
CREATE TABLE public.verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES public.influencers(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'identity',
  document_type text,
  document_url text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewer text,
  decision text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_requests TO anon, authenticated;
GRANT ALL ON public.verification_requests TO service_role;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verification_requests" ON public.verification_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert verification_requests" ON public.verification_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update verification_requests" ON public.verification_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete verification_requests" ON public.verification_requests FOR DELETE USING (true);
CREATE TRIGGER verification_requests_set_updated_at BEFORE UPDATE ON public.verification_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
