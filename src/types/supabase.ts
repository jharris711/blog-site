export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          author: string | null
          author_img_url: string
          blog_type: string | null
          created_at: string | null
          description: string | null
          file_name: string | null
          file_url: string | null
          id: string
          main_img_url: string | null
          secondary_img_url: string | null
          stackblitz_element_id: string | null
          stackblitz_project_id: string | null
          stackblitz_url: string | null
          tag: string
          title: string | null
        }
        Insert: {
          author?: string | null
          author_img_url: string
          blog_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          main_img_url?: string | null
          secondary_img_url?: string | null
          stackblitz_element_id?: string | null
          stackblitz_project_id?: string | null
          stackblitz_url?: string | null
          tag?: string
          title?: string | null
        }
        Update: {
          author?: string | null
          author_img_url?: string
          blog_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          main_img_url?: string | null
          secondary_img_url?: string | null
          stackblitz_element_id?: string | null
          stackblitz_project_id?: string | null
          stackblitz_url?: string | null
          tag?: string
          title?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          blog_id: string | null
          content: string | null
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          blog_id?: string | null
          content?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          blog_id?: string | null
          content?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          blog_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: number
        }
        Insert: {
          created_at?: string | null
          email?: string
          id?: number
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
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
