export interface User {
  id: number
  wallet_address: string
  display_name: string | null
  bio: string | null
  created_at: string
}

export interface Job {
  id: number
  poster_id: number
  title: string
  description: string
  budget_lamports: number
  status: 'open' | 'assigned' | 'completed' | 'cancelled'
  assigned_to: number | null
  darkdrop_claim_code: string | null
  darkdrop_password: string | null
  created_at: string
}

export interface Escrow {
  id: number
  job_id: number
  claim_code: string
  password: string
  amount_lamports: number
  platform_fee_lamports: number
  status: 'locked' | 'released' | 'refunded'
  created_at: string
}
