import { z } from 'zod'
import { currencies } from '@/types/api'

export const receiptAmountSchema = z.object({
  amount: z.number({ error: 'Enter the amount from the receipt' }).min(0.01, 'Amount must be at least 0.01'),
  currency: z.enum(currencies),
})

export type ReceiptAmountValues = z.infer<typeof receiptAmountSchema>
