import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { subscriptionSchema, type SubscriptionValues } from '@/schemas/subscription'
import { categories, currencies, frequencies, subscriptionStatuses, type SubscriptionRequest } from '@/types/api'
import { humanize, selectClass } from '@/lib/utils'

interface SubscriptionFormProps {
  initialValues?: SubscriptionRequest
  onSubmit: (values: SubscriptionValues) => Promise<void>
  pending: boolean
  submitLabel: string
  serverError?: string
}

export function SubscriptionForm({ initialValues, onSubmit, pending, submitLabel, serverError }: SubscriptionFormProps) {
  const form = useForm<SubscriptionValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: initialValues ?? { name: '', price: 0, currency: 'UZS', frequency: 'MONTHLY', status: 'ACTIVE', category: 'OTHER', startDate: new Date().toISOString().slice(0, 10) },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Card className="max-w-3xl"><CardContent className="p-6 sm:p-8">
        {serverError && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{serverError}</div>}
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Name" error={form.formState.errors.name?.message} className="sm:col-span-2"><Input placeholder="e.g. Cloud storage" maxLength={120} {...form.register('name')} /></FormField>
          <FormField label="Price" error={form.formState.errors.price?.message}><Input type="number" min="0.01" step="0.01" inputMode="decimal" {...form.register('price', { valueAsNumber: true })} /></FormField>
          <FormField label="Currency" error={form.formState.errors.currency?.message}><select className={selectClass} {...form.register('currency')}>{currencies.map((item) => <option key={item}>{item}</option>)}</select></FormField>
          <FormField label="Billing frequency" error={form.formState.errors.frequency?.message}><select className={selectClass} {...form.register('frequency')}>{frequencies.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}</select></FormField>
          <FormField label="Category" error={form.formState.errors.category?.message}><select className={selectClass} {...form.register('category')}>{categories.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}</select></FormField>
          <FormField label="Status" error={form.formState.errors.status?.message}><select className={selectClass} {...form.register('status')}>{subscriptionStatuses.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}</select></FormField>
          <FormField label="Start date" error={form.formState.errors.startDate?.message}><Input type="date" {...form.register('startDate')} /></FormField>
        </div>
        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row"><Button asChild variant="outline"><Link to="/subscriptions">Cancel</Link></Button><Button type="submit" variant="accent" disabled={pending}>{pending ? 'Saving…' : submitLabel}</Button></div>
      </CardContent></Card>
    </form>
  )
}

function FormField({ label, error, className, children }: { label: string; error?: string; className?: string; children: ReactNode }) {
  return <label className={className}><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}{error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}</label>
}
