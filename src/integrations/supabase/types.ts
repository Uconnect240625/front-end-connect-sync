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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          title: string
          type: string
          university_id: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
          type: string
          university_id: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          type?: string
          university_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      club_events: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"] | null
          club_id: string
          created_at: string | null
          description: string | null
          event_date: string
          event_time: string | null
          id: string
          is_paid: boolean | null
          location: string | null
          title: string
          university_id: string
          updated_at: string | null
        }
        Insert: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          club_id: string
          created_at?: string | null
          description?: string | null
          event_date: string
          event_time?: string | null
          id?: string
          is_paid?: boolean | null
          location?: string | null
          title: string
          university_id: string
          updated_at?: string | null
        }
        Update: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          club_id?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_time?: string | null
          id?: string
          is_paid?: boolean | null
          location?: string | null
          title?: string
          university_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_events_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_messages: {
        Row: {
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          message: string | null
          university_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          message?: string | null
          university_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          message?: string | null
          university_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          admin_response: string | null
          category: string
          created_at: string | null
          description: string
          file_url: string | null
          id: string
          status: Database["public"]["Enums"]["complaint_status"] | null
          title: string
          university_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          category: string
          created_at?: string | null
          description: string
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          title: string
          university_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_response?: string | null
          category?: string
          created_at?: string | null
          description?: string
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          title?: string
          university_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"] | null
          category: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          image_urls: string[] | null
          is_paid: boolean | null
          price: number
          title: string
          university_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          category?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_paid?: boolean | null
          price: number
          title: string
          university_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          category?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_paid?: boolean | null
          price?: number
          title?: string
          university_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      mess_menus: {
        Row: {
          created_at: string | null
          day_of_week: number
          id: string
          items: string
          meal_type: string
          university_id: string
          updated_at: string | null
          week_start_date: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          id?: string
          items: string
          meal_type: string
          university_id: string
          updated_at?: string | null
          week_start_date: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          id?: string
          items?: string
          meal_type?: string
          university_id?: string
          updated_at?: string | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "mess_menus_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          likes_count: number | null
          subject: string
          tags: string[] | null
          title: string
          university_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          likes_count?: number | null
          subject: string
          tags?: string[] | null
          title: string
          university_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          likes_count?: number | null
          subject?: string
          tags?: string[] | null
          title?: string
          university_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          university_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          university_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          university_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      pg_listings: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"] | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          is_paid: boolean | null
          location: string | null
          price: number | null
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          university_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean | null
          location?: string | null
          price?: number | null
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          university_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean | null
          location?: string | null
          price?: number | null
          title?: string
          type?: Database["public"]["Enums"]["listing_type"]
          university_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pg_listings_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_acceptances: {
        Row: {
          accepted_at: string
          created_at: string
          id: string
          ip_address: string | null
          policy_version: string
          user_id: string
        }
        Insert: {
          accepted_at?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          policy_version?: string
          user_id: string
        }
        Update: {
          accepted_at?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          policy_version?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          policies_accepted: boolean | null
          policies_accepted_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          university_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          policies_accepted?: boolean | null
          policies_accepted_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          university_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          policies_accepted?: boolean | null
          policies_accepted_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          university_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_requests: {
        Row: {
          approval_status: string
          budget: number
          contact_number: string
          created_at: string
          gender: string
          id: string
          location: string
          preferences: string | null
          requester_name: string
          university_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_status?: string
          budget: number
          contact_number: string
          created_at?: string
          gender: string
          id?: string
          location: string
          preferences?: string | null
          requester_name: string
          university_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_status?: string
          budget?: number
          contact_number?: string
          created_at?: string
          gender?: string
          id?: string
          location?: string
          preferences?: string | null
          requester_name?: string
          university_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_missing_profiles: { Args: never; Returns: undefined }
      get_all_profiles: {
        Args: never
        Returns: {
          created_at: string
          full_name: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          university_id: string
          updated_at: string
        }[]
      }
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_university_id: { Args: never; Returns: string }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      complaint_status: "open" | "in_progress" | "resolved" | "closed"
      listing_type: "pg" | "roommate"
      user_role: "student" | "admin" | "club"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected"],
      complaint_status: ["open", "in_progress", "resolved", "closed"],
      listing_type: ["pg", "roommate"],
      user_role: ["student", "admin", "club"],
    },
  },
} as const
