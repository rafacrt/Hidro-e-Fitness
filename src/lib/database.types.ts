
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academy_settings: {
        Row: {
          created_at: string
          id: number
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          class_id: string
          created_at: string
          id: string
          notes: string | null
          student_id: string
          status: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          notes?: string | null
          student_id: string
          status: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          student_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          days_of_week: string[]
          end_time: string
          id: string
          instructor_id: string | null
          location: string | null
          max_students: number | null
          modality_id: string | null
          name: string | null
          start_time: string
          status: string | null
        }
        Insert: {
          created_at?: string
          days_of_week: string[]
          end_time: string
          id?: string
          instructor_id?: string | null
          location?: string | null
          max_students?: number | null
          modality_id?: string | null
          name?: string | null
          start_time: string
          status?: string | null
        }
        Update: {
          created_at?: string
          days_of_week?: string[]
          end_time?: string
          id?: string
          instructor_id?: string | null
          location?: string | null
          max_students?: number | null
          modality_id?: string | null
          name?: string | null
          start_time?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_modality_id_fkey"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "modalities"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          class_id: string
          created_at: string
          id: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      equipments: {
        Row: {
          brand: string | null
          category: string
          created_at: string
          id: string
          installation_date: string
          location: string
          model: string | null
          name: string
          serial_number: string | null
          status: string
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string
          id?: string
          installation_date: string
          location: string
          model?: string | null
          name: string
          serial_number?: string | null
          status: string
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string
          id?: string
          installation_date?: string
          location?: string
          model?: string | null
          name?: string
          serial_number?: string | null
          status?: string
        }
        Relationships: []
      }
      instructors: {
        Row: {
          availability: Json | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          specialties: Json | null
        }
        Insert: {
          availability?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          specialties?: Json | null
        }
        Update: {
          availability?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialties?: Json | null
        }
        Relationships: []
      }
      maintenance_schedules: {
        Row: {
          completed_at: string | null
          cost: number | null
          created_at: string
          description: string
          equipment_id: string
          id: string
          priority: string
          responsible: string | null
          scheduled_date: string
          status: string
          type: string
        }
        Insert: {
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          description: string
          equipment_id: string
          id?: string
          priority?: string
          responsible?: string | null
          scheduled_date: string
          status?: string
          type?: string
        }
        Update: {
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          equipment_id?: string
          id?: string
          priority?: string
          responsible?: string | null
          scheduled_date?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
        ]
      }
      modalities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string
          description: string
          due_date: string
          id: string
          paid_at: string | null
          payment_method: string | null
          status: string
          student_id: string | null
          type: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string
          description: string
          due_date: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          student_id?: string | null
          type?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          student_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          benefits: string[] | null
          created_at: string
          id: string
          modality_id: string
          name: string
          price: number
          recurrence: string
          status: string
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string
          id?: string
          modality_id: string
          name: string
          price: number
          recurrence: string
          status?: string
        }
        Update: {
          benefits?: string[] | null
          created_at?: string
          id?: string
          modality_id?: string
          name?: string
          price?: number
          recurrence?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_modality_id_fkey"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "modalities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          category: string
          created_at: string
          filters: Json | null
          id: string
          last_generated_at: string
          name: string
          times_generated: number
        }
        Insert: {
          category?: string
          created_at?: string
          filters?: Json | null
          id?: string
          last_generated_at?: string
          name: string
          times_generated?: number
        }
        Update: {
          category?: string
          created_at?: string
          filters?: Json | null
          id?: string
          last_generated_at?: string
          name?: string
          times_generated?: number
        }
        Relationships: []
      }
      student_plans: {
        Row: {
          created_at: string
          id: string
          plan_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_plans_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          birth_date: string | null
          cep: string | null
          city: string | null
          complement: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          is_whatsapp: boolean | null
          medical_observations: string | null
          name: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          responsible_name: string | null
          responsible_phone: string | null
          state: string | null
          status: string | null
          street: string | null
        }
        Insert: {
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_whatsapp?: boolean | null
          medical_observations?: string | null
          name: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          responsible_name?: string | null
          responsible_phone?: string | null
          state?: string | null
          status?: string | null
          street?: string | null
        }
        Update: {
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_whatsapp?: boolean | null
          medical_observations?: string | null
          name?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          responsible_name?: string | null
          responsible_phone?: string | null
          state?: string | null
          status?: string | null
          street?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

    

    


