/**
 * Supabase Database type definitions.
 *
 * In production, generate this file automatically with:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
 *
 * Below is the starter schema for WeaveOne.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_number: string;
          client_name: string;
          client_contact: string | null;
          description: string | null;
          requirements: Json | null;
          status: string;
          current_stage: string;
          priority: string;
          deadline: string | null;
          created_by: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          client_name: string;
          client_contact?: string | null;
          description?: string | null;
          requirements?: Json | null;
          status?: string;
          current_stage?: string;
          priority?: string;
          deadline?: string | null;
          created_by: string;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          client_name?: string;
          client_contact?: string | null;
          description?: string | null;
          requirements?: Json | null;
          status?: string;
          current_stage?: string;
          priority?: string;
          deadline?: string | null;
          created_by?: string;
          assigned_to?: string | null;
          updated_at?: string;
        };
      };
      styles: {
        Row: {
          id: string;
          order_id: string;
          style_number: string;
          name: string;
          category: string | null;
          description: string | null;
          design_images: Json | null;
          specifications: Json | null;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          style_number: string;
          name: string;
          category?: string | null;
          description?: string | null;
          design_images?: Json | null;
          specifications?: Json | null;
          status?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          style_number?: string;
          name?: string;
          category?: string | null;
          description?: string | null;
          design_images?: Json | null;
          specifications?: Json | null;
          status?: string;
          updated_at?: string;
        };
      };
      fabrics: {
        Row: {
          id: string;
          order_id: string;
          style_id: string | null;
          name: string;
          fabric_code: string;
          material: string | null;
          color: string | null;
          weight: string | null;
          width: string | null;
          supplier: string | null;
          unit_price: number | null;
          quantity: number | null;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          style_id?: string | null;
          name: string;
          fabric_code: string;
          material?: string | null;
          color?: string | null;
          weight?: string | null;
          width?: string | null;
          supplier?: string | null;
          unit_price?: number | null;
          quantity?: number | null;
          status?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          style_id?: string | null;
          name?: string;
          fabric_code?: string;
          material?: string | null;
          color?: string | null;
          weight?: string | null;
          width?: string | null;
          supplier?: string | null;
          unit_price?: number | null;
          quantity?: number | null;
          status?: string;
          updated_at?: string;
        };
      };
      crafts: {
        Row: {
          id: string;
          order_id: string;
          style_id: string | null;
          process_name: string;
          process_code: string;
          description: string | null;
          steps: Json | null;
          equipment: Json | null;
          estimated_hours: number | null;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          style_id?: string | null;
          process_name: string;
          process_code: string;
          description?: string | null;
          steps?: Json | null;
          equipment?: Json | null;
          estimated_hours?: number | null;
          status?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          style_id?: string | null;
          process_name?: string;
          process_code?: string;
          description?: string | null;
          steps?: Json | null;
          equipment?: Json | null;
          estimated_hours?: number | null;
          status?: string;
          updated_at?: string;
        };
      };
      patterns: {
        Row: {
          id: string;
          order_id: string;
          style_id: string | null;
          pattern_code: string;
          version: string;
          size_range: Json | null;
          grading_rules: Json | null;
          file_url: string | null;
          notes: string | null;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          style_id?: string | null;
          pattern_code: string;
          version?: string;
          size_range?: Json | null;
          grading_rules?: Json | null;
          file_url?: string | null;
          notes?: string | null;
          status?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          style_id?: string | null;
          pattern_code?: string;
          version?: string;
          size_range?: Json | null;
          grading_rules?: Json | null;
          file_url?: string | null;
          notes?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      deliveries: {
        Row: {
          id: string;
          order_id: string;
          delivery_number: string;
          shipment_method: string | null;
          tracking_number: string | null;
          estimated_date: string | null;
          actual_date: string | null;
          quantity: number | null;
          quality_check: Json | null;
          status: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          delivery_number: string;
          shipment_method?: string | null;
          tracking_number?: string | null;
          estimated_date?: string | null;
          actual_date?: string | null;
          quantity?: number | null;
          quality_check?: Json | null;
          status?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          delivery_number?: string;
          shipment_method?: string | null;
          tracking_number?: string | null;
          estimated_date?: string | null;
          actual_date?: string | null;
          quantity?: number | null;
          quality_check?: Json | null;
          status?: string;
          updated_at?: string;
        };
      };
      workflow_logs: {
        Row: {
          id: string;
          order_id: string;
          from_stage: string;
          to_stage: string;
          action: string;
          operator_id: string;
          notes: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          from_stage: string;
          to_stage: string;
          action: string;
          operator_id: string;
          notes?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          from_stage?: string;
          to_stage?: string;
          action?: string;
          operator_id?: string;
          notes?: string | null;
          metadata?: Json | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: "draft" | "active" | "on_hold" | "completed" | "cancelled";
      workflow_stage:
        | "order_intake"
        | "style_design"
        | "fabric_selection"
        | "craft_planning"
        | "pattern_making"
        | "delivery";
      priority_level: "low" | "medium" | "high" | "urgent";
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
