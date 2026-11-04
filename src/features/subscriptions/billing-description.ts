import type { BillingPlatform, PaymentMethod, Subscription } from '@/types/api'

export interface BillingDescription {
  plan: string | null
  billedThrough: string | null
  paymentMethod: string | null
}

const PLATFORM_NAMES: Record<BillingPlatform, string> = {
  APPLE: 'Apple',
  GOOGLE_PLAY: 'Google Play',
  PAYPAL: 'PayPal',
}

export function describeBilling(subscription: Pick<Subscription, 'planName' | 'billingPlatform' | 'paymentMethod'>): BillingDescription {
  return {
    plan: subscription.planName,
    billedThrough: subscription.billingPlatform ? `Billed through ${PLATFORM_NAMES[subscription.billingPlatform]}` : null,
    paymentMethod: subscription.paymentMethod ? describePaymentMethod(subscription.paymentMethod) : null,
  }
}

function describePaymentMethod(method: PaymentMethod): string {
  if (method.type === 'PAYPAL') return 'PayPal'
  const name = method.cardBrand ?? 'Card'
  return method.cardLast4 ? `${name} •••• ${method.cardLast4}` : name
}
