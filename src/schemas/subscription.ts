import { z } from 'zod'
import { categories, currencies, frequencies, subscriptionStatuses } from '@/types/api'

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Use 120 characters or fewer'),
  price: z.number({ error: 'Enter a valid price' }).min(0.01, 'Price must be at least 0.01'),
  currency: z.enum(currencies),
  frequency: z.enum(frequencies),
  status: z.enum(subscriptionStatuses),
  category: z.enum(categories),
  startDate: z.string().min(1, 'Start date is required'),
})

export type SubscriptionValues = z.infer<typeof subscriptionSchema>
