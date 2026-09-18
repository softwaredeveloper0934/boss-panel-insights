export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          categories: string[]
          country: string | null
          created_at: string
          email: string | null
          followers: number
          full_name: string
          handle: string
          id: string
          platform: string | null
          reviewer: string | null
          reviewer_note: string | null
          risk_score: number
          source: string
          stage: string
          updated_at: string
        }
        Insert: {
          categories?: string[]
          country?: string | null
          created_at?: string
          email?: string | null
          followers?: number
          full_name: string
          handle: string
          id?: string
          platform?: string | null
          reviewer?: string | null
          reviewer_note?: string | null
          risk_score?: number
          source?: string
          stage?: string
          updated_at?: string
        }
        Update: {
          categories?: string[]
          country?: string | null
          created_at?: string
          email?: string | null
          followers?: number
          full_name?: string
          handle?: string
          id?: string
          platform?: string | null
          reviewer?: string | null
          reviewer_note?: string | null
          risk_score?: number
          source?: string
          stage?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          contact_email: string | null
          country: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          notes: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      campaign_creators: {
        Row: {
          campaign_id: string
          created_at: string
          deliverables: string | null
          fee: number
          id: string
          influencer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          deliverables?: string | null
          fee?: number
          id?: string
          influencer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          deliverables?: string | null
          fee?: number
          id?: string
          influencer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          approval: string
          brand_id: string | null
          brand_name: string | null
          brief: string | null
          budget: number
          created_at: string
          end_date: string | null
          id: string
          name: string
          objective: string
          spent: number
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approval?: string
          brand_id?: string | null
          brand_name?: string | null
          brief?: string | null
          budget?: number
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          objective?: string
          spent?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approval?: string
          brand_id?: string | null
          brand_name?: string | null
          brief?: string | null
          budget?: number
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          objective?: string
          spent?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborations: {
        Row: {
          brand_id: string | null
          campaign_id: string | null
          created_at: string
          end_date: string | null
          id: string
          influencer_id: string | null
          notes: string | null
          start_date: string | null
          status: string
          title: string
          type: string
          updated_at: string
          value: number
        }
        Insert: {
          brand_id?: string | null
          campaign_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          influencer_id?: string | null
          notes?: string | null
          start_date?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          value?: number
        }
        Update: {
          brand_id?: string | null
          campaign_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          influencer_id?: string | null
          notes?: string | null
          start_date?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          approval: string
          asset_url: string | null
          campaign_id: string | null
          clicks: number
          comments: number
          created_at: string
          id: string
          influencer_id: string | null
          likes: number
          platform: string | null
          published_at: string | null
          scheduled_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
          views: number
        }
        Insert: {
          approval?: string
          asset_url?: string | null
          campaign_id?: string | null
          clicks?: number
          comments?: number
          created_at?: string
          id?: string
          influencer_id?: string | null
          likes?: number
          platform?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          views?: number
        }
        Update: {
          approval?: string
          asset_url?: string | null
          campaign_id?: string | null
          clicks?: number
          comments?: number
          created_at?: string
          id?: string
          influencer_id?: string | null
          likes?: number
          platform?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_items_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          attempts: number
          channel: string
          created_at: string
          due_at: string
          id: string
          last_error: string | null
          lead_name: string
          status: string
          updated_at: string
          workspace_key: string
        }
        Insert: {
          attempts?: number
          channel: string
          created_at?: string
          due_at: string
          id?: string
          last_error?: string | null
          lead_name: string
          status?: string
          updated_at?: string
          workspace_key?: string
        }
        Update: {
          attempts?: number
          channel?: string
          created_at?: string
          due_at?: string
          id?: string
          last_error?: string | null
          lead_name?: string
          status?: string
          updated_at?: string
          workspace_key?: string
        }
        Relationships: []
      }
      influencers: {
        Row: {
          categories: string[]
          commission: number
          country: string | null
          created_at: string
          email: string | null
          engagement_rate: number
          followers: number
          full_name: string
          handle: string
          health_score: number
          id: string
          languages: string[]
          notes: string | null
          platform: string | null
          revenue: number
          risk_score: number
          status: string
          tier: string | null
          updated_at: string
          verification: string
        }
        Insert: {
          categories?: string[]
          commission?: number
          country?: string | null
          created_at?: string
          email?: string | null
          engagement_rate?: number
          followers?: number
          full_name: string
          handle: string
          health_score?: number
          id?: string
          languages?: string[]
          notes?: string | null
          platform?: string | null
          revenue?: number
          risk_score?: number
          status?: string
          tier?: string | null
          updated_at?: string
          verification?: string
        }
        Update: {
          categories?: string[]
          commission?: number
          country?: string | null
          created_at?: string
          email?: string | null
          engagement_rate?: number
          followers?: number
          full_name?: string
          handle?: string
          health_score?: number
          id?: string
          languages?: string[]
          notes?: string | null
          platform?: string | null
          revenue?: number
          risk_score?: number
          status?: string
          tier?: string | null
          updated_at?: string
          verification?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          influencer_id: string | null
          method: string
          paid_at: string | null
          period: string | null
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          influencer_id?: string | null
          method?: string
          paid_at?: string | null
          period?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          influencer_id?: string | null
          method?: string
          paid_at?: string | null
          period?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          awarded_at: string
          created_at: string
          id: string
          influencer_id: string | null
          kind: string
          notes: string | null
          points: number
          status: string
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          awarded_at?: string
          created_at?: string
          id?: string
          influencer_id?: string | null
          kind?: string
          notes?: string | null
          points?: number
          status?: string
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          awarded_at?: string
          created_at?: string
          id?: string
          influencer_id?: string | null
          kind?: string
          notes?: string | null
          points?: number
          status?: string
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "rewards_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          created_at: string
          engagement_rate: number
          followers: number
          handle: string
          id: string
          influencer_id: string | null
          platform: string
          profile_url: string | null
          status: string
          updated_at: string
          verification: string
        }
        Insert: {
          created_at?: string
          engagement_rate?: number
          followers?: number
          handle: string
          id?: string
          influencer_id?: string | null
          platform: string
          profile_url?: string | null
          status?: string
          updated_at?: string
          verification?: string
        }
        Update: {
          created_at?: string
          engagement_rate?: number
          followers?: number
          handle?: string
          id?: string
          influencer_id?: string | null
          platform?: string
          profile_url?: string | null
          status?: string
          updated_at?: string
          verification?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          created_at: string
          decision: string
          document_type: string | null
          document_url: string | null
          id: string
          influencer_id: string | null
          kind: string
          notes: string | null
          reviewed_at: string | null
          reviewer: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          decision?: string
          document_type?: string | null
          document_url?: string | null
          id?: string
          influencer_id?: string | null
          kind?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          decision?: string
          document_type?: string | null
          document_url?: string | null
          id?: string
          influencer_id?: string | null
          kind?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          description: string | null
          direction: string
          id: string
          influencer_id: string | null
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          direction?: string
          id?: string
          influencer_id?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          direction?: string
          id?: string
          influencer_id?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
