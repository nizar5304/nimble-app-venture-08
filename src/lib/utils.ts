
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type extensions until Supabase types are regenerated
export type ProfileWithRole = {
  id: string;
  avatar_url: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
  role?: 'admin' | 'owner' | 'staff';
}

export type StaffMember = {
  id: string;
  staff_name: string;
  user_id: string;
  owner_id: string;
  created_at: string;
  email?: string;
}
