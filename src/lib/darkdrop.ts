// DarkDrop relayer API integration
// Docs: https://github.com/hitman-kai/darkdropv4

const DARKDROP_RELAYER_URL = process.env.DARKDROP_RELAYER_URL || 'http://localhost:3001'
const PLATFORM_FEE_BPS = parseInt(process.env.PLATFORM_FEE_BPS || '200') // 2% default

export interface CreateDropResult {
  claimCode: string
  password: string
  txSignature: string
}

export interface ClaimResult {
  txSignature: string
}

export interface WithdrawResult {
  txSignature: string
}

/**
 * Create a DarkDrop escrow for a job.
 * Client deposits SOL into the DarkDrop vault and gets a claim code + password.
 * The claim code proves funds are locked. Password is needed to claim.
 */
export async function createDrop(params: {
  amountLamports: number
  depositorPubkey: string
}): Promise<CreateDropResult> {
  const response = await fetch(`${DARKDROP_RELAYER_URL}/api/relay/create-drop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: params.amountLamports,
      sender: params.depositorPubkey,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DarkDrop create-drop failed: ${error}`)
  }

  const data = await response.json()
  return {
    claimCode: data.claimCode || data.claim_code,
    password: data.password,
    txSignature: data.signature || data.txSignature,
  }
}

/**
 * Claim a credit note using the password.
 * This is called by the freelancer after receiving the password from the client.
 */
export async function claimCredit(params: {
  claimCode: string
  password: string
  claimerPubkey: string
}): Promise<ClaimResult> {
  const response = await fetch(`${DARKDROP_RELAYER_URL}/api/relay/credit/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      claimCode: params.claimCode,
      password: params.password,
      recipient: params.claimerPubkey,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DarkDrop claim failed: ${error}`)
  }

  const data = await response.json()
  return { txSignature: data.signature || data.txSignature }
}

/**
 * Withdraw SOL from a credit note to the freelancer's wallet.
 */
export async function withdrawCredit(params: {
  claimCode: string
  password: string
  recipientPubkey: string
}): Promise<WithdrawResult> {
  const response = await fetch(`${DARKDROP_RELAYER_URL}/api/relay/credit/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      claimCode: params.claimCode,
      password: params.password,
      recipient: params.recipientPubkey,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DarkDrop withdraw failed: ${error}`)
  }

  const data = await response.json()
  return { txSignature: data.signature || data.txSignature }
}

/**
 * Calculate platform fee from total amount.
 */
export function calculatePlatformFee(amountLamports: number): number {
  return Math.floor(amountLamports * PLATFORM_FEE_BPS / 10000)
}

/**
 * Calculate freelancer payout after platform fee.
 */
export function calculatePayout(amountLamports: number): number {
  return amountLamports - calculatePlatformFee(amountLamports)
}
