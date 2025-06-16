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
      clientes: {
        Row: {
          data_fim: string
          data_inicio: string
          forma_pagamento: string
          id: number
          nome: string
          proxima_cobranca: string
          status: string
          tipo_servico: string
          valor: number
        }
        Insert: {
          data_fim: string
          data_inicio: string
          forma_pagamento: string
          id?: number
          nome: string
          proxima_cobranca: string
          status: string
          tipo_servico: string
          valor: number
        }
        Update: {
          data_fim?: string
          data_inicio?: string
          forma_pagamento?: string
          id?: number
          nome?: string
          proxima_cobranca?: string
          status?: string
          tipo_servico?: string
          valor?: number
        }
        Relationships: []
      }
      contatos_mensagens: {
        Row: {
          email: string | null
          id: number
          nome: string
          telefone: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          nome: string
          telefone?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      entradas: {
        Row: {
          categoria: string | null
          cliente: string | null
          comprovante: string | null
          data: string | null
          descricao: string | null
          forma: string | null
          id: number
          observacoes: string | null
          recorrente: boolean | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          cliente?: string | null
          comprovante?: string | null
          data?: string | null
          descricao?: string | null
          forma?: string | null
          id?: number
          observacoes?: string | null
          recorrente?: boolean | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          cliente?: string | null
          comprovante?: string | null
          data?: string | null
          descricao?: string | null
          forma?: string | null
          id?: number
          observacoes?: string | null
          recorrente?: boolean | null
          valor?: number | null
        }
        Relationships: []
      }
      entradas_financeiras: {
        Row: {
          cliente: string
          comprovante: string | null
          data: string
          forma: string | null
          id: number
          observacoes: string | null
          valor: number
        }
        Insert: {
          cliente: string
          comprovante?: string | null
          data: string
          forma?: string | null
          id?: number
          observacoes?: string | null
          valor: number
        }
        Update: {
          cliente?: string
          comprovante?: string | null
          data?: string
          forma?: string | null
          id?: number
          observacoes?: string | null
          valor?: number
        }
        Relationships: []
      }
      faturas: {
        Row: {
          anexo: string | null
          cliente_id: number
          data_pagamento: string | null
          id: number
          mes_referencia: string
          status: string
          valor: number
          vencimento: string
        }
        Insert: {
          anexo?: string | null
          cliente_id: number
          data_pagamento?: string | null
          id?: number
          mes_referencia: string
          status: string
          valor: number
          vencimento: string
        }
        Update: {
          anexo?: string | null
          cliente_id?: number
          data_pagamento?: string | null
          id?: number
          mes_referencia?: string
          status?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "faturas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      membros: {
        Row: {
          avatar: string | null
          data_entrada: string
          email: string
          funcao: string
          id: number
          nome: string
          status: string
          tarefas_ativas: number
        }
        Insert: {
          avatar?: string | null
          data_entrada: string
          email: string
          funcao: string
          id?: number
          nome: string
          status: string
          tarefas_ativas?: number
        }
        Update: {
          avatar?: string | null
          data_entrada?: string
          email?: string
          funcao?: string
          id?: number
          nome?: string
          status?: string
          tarefas_ativas?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      saidas: {
        Row: {
          categoria: string | null
          data: string | null
          descricao: string | null
          id: number
          recorrente: boolean | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          data?: string | null
          descricao?: string | null
          id?: number
          recorrente?: boolean | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          data?: string | null
          descricao?: string | null
          id?: number
          recorrente?: boolean | null
          valor?: number | null
        }
        Relationships: []
      }
      saidas_financeiras: {
        Row: {
          categoria: string
          data: string
          descricao: string | null
          id: number
          recorrente: boolean
          valor: number
        }
        Insert: {
          categoria: string
          data: string
          descricao?: string | null
          id?: number
          recorrente?: boolean
          valor: number
        }
        Update: {
          categoria?: string
          data?: string
          descricao?: string | null
          id?: number
          recorrente?: boolean
          valor?: number
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          cliente: string
          id: number
          prazo: string
          prioridade: string
          progresso: number
          responsavel_id: number
          status: string
          titulo: string
        }
        Insert: {
          cliente: string
          id?: number
          prazo: string
          prioridade: string
          progresso?: number
          responsavel_id: number
          status: string
          titulo: string
        }
        Update: {
          cliente?: string
          id?: number
          prazo?: string
          prioridade?: string
          progresso?: number
          responsavel_id?: number
          status?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          criado_em: string | null
          email: string
          id: number
          role: string
          senha: string
        }
        Insert: {
          criado_em?: string | null
          email: string
          id?: number
          role?: string
          senha: string
        }
        Update: {
          criado_em?: string | null
          email?: string
          id?: number
          role?: string
          senha?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
