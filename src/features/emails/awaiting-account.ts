import axios from 'axios'
import { z } from 'zod'

const accountOptionSchema = z.object({
  subscriptionId: z.number(),
  name: z.string(),
  customerReference: z.string().nullable(),
})

const awaitingAccountEmailSchema = z.object({
  emailId: z.number(),
  kind: z.enum(['RECEIPT', 'CANCELLATION', 'PAYMENT_FAILED']),
  sender: z.string().nullable(),
  subject: z.string().nullable(),
  receivedAt: z.string(),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  accounts: z.array(accountOptionSchema),
})

export type AccountOption = z.infer<typeof accountOptionSchema>
export type AwaitingAccountEmail = z.infer<typeof awaitingAccountEmailSchema>

export function parseAwaitingAccount(data: unknown): AwaitingAccountEmail[] {
  return z.array(awaitingAccountEmailSchema).parse(data)
}

export async function fetchAwaitingAccount(get: () => Promise<unknown>): Promise<AwaitingAccountEmail[]> {
  try {
    return parseAwaitingAccount(await get())
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return []
    throw error
  }
}

export function labelAccountOption(option: AccountOption): string {
  return `${option.name} · ${option.customerReference ?? 'no customer ID'}`
}
