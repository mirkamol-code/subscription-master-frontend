import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { CategoryIcon } from '@/components/common/category-icon'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Select } from '@/components/ui/input'
import { getCategoryMeta } from '@/lib/category-config'
import { getStatusChoices } from '@/features/subscriptions/status-choices'
import { CURRENCY_META, FREQUENCY_LABEL, FREQUENCY_SUFFIX, getStatusLabel } from '@/lib/labels'
import { formatDate, formatMoney, getAnnualizedCost } from '@/lib/utils'
import { subscriptionSchema, type SubscriptionValues } from '@/schemas/subscription'
import {
  categories,
  currencies,
  frequencies,
  type SubscriptionRequest,
} from '@/types/api'

interface SubscriptionFormProps {
  initialValues: SubscriptionRequest
  /** May resolve to the server's per-field messages, which are shown under each field. */
  onSubmit: (values: SubscriptionValues) => Promise<Record<string, string> | void>
  pending: boolean
  submitLabel: string
  cancelHref: string
  serverError?: string
}

function toFormValues(initial: SubscriptionRequest): SubscriptionValues {
  const { name, price, currency, frequency, status, category, startDate } = initial
  return { name, price, currency, frequency, status, category, startDate }
}

export function SubscriptionForm({
  initialValues,
  onSubmit,
  pending,
  submitLabel,
  cancelHref,
  serverError,
}: SubscriptionFormProps) {
  const form = useForm<SubscriptionValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: toFormValues(initialValues),
  })
  const { errors } = form.formState
  const preview = useWatch({ control: form.control })
  const initialStatus = initialValues.status
  const statusOptions = [initialStatus, ...getStatusChoices(initialStatus)]

  const submit = form.handleSubmit(async (values) => {
    const fieldErrors = await onSubmit(values)
    for (const [field, message] of Object.entries(fieldErrors ?? {})) {
      if (field in values) form.setError(field as keyof SubscriptionValues, { message })
    }
  })

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="divide-y divide-border">
        {serverError && (
          <div role="alert" className="rounded-t-2xl bg-danger/10 px-6 py-4 text-sm text-danger">
            {serverError}
          </div>
        )}

        <fieldset className="space-y-5 p-6">
          <Field label="Name" error={errors.name?.message}>
            <Input
              placeholder="Netflix, Spotify, iCloud…"
              maxLength={120}
              autoFocus={!initialValues}
              aria-invalid={!!errors.name}
              {...form.register('name')}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
            <Field label="Price" error={errors.price?.message}>
              <Input
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                aria-invalid={!!errors.price}
                {...form.register('price', { valueAsNumber: true })}
              />
            </Field>
            <Field label="Currency" error={errors.currency?.message}>
              <Select {...form.register('currency')}>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {CURRENCY_META[currency].flag} {currency}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Billed" as="div">
            <Segmented
              options={frequencies.map((value) => ({ value, label: FREQUENCY_LABEL[value] }))}
              register={form.register('frequency')}
            />
          </Field>

          <Field label="Start date" error={errors.startDate?.message}>
            <Input type="date" aria-invalid={!!errors.startDate} {...form.register('startDate')} />
          </Field>
        </fieldset>

        <fieldset className="p-6">
          <legend className="sr-only">Category</legend>
          <p className="mb-3 text-sm font-medium text-fg">Category</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((category) => {
              const meta = getCategoryMeta(category)
              const Icon = meta.icon
              return (
                <label key={category} className="cursor-pointer">
                  <input type="radio" value={category} className="peer sr-only" {...form.register('category')} />
                  <span className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-[13px] font-medium text-muted transition-all hover:border-fg/20 peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-fg peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{meta.label}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="p-6">
          <legend className="sr-only">Status</legend>
          <p className="mb-3 text-sm font-medium text-fg">Status</p>
          <Segmented
            options={statusOptions.map((value) => ({ value, label: getStatusLabel(value) }))}
            register={form.register('status')}
          />
        </fieldset>

        <div className="flex flex-col-reverse gap-2 p-6 sm:flex-row sm:justify-end">
          <Button asChild variant="ghost">
            <Link to={cancelHref}>Cancel</Link>
          </Button>
          <Button type="submit" variant="gradient" disabled={pending} className="sm:min-w-36">
            {pending ? 'Saving…' : submitLabel}
          </Button>
        </div>
      </Card>

      <PreviewCard values={preview} />
    </form>
  )
}

function PreviewCard({ values }: { values: Partial<SubscriptionValues> }) {
  const category = values.category ?? 'OTHER'
  const frequency = values.frequency ?? 'MONTHLY'
  const currency = values.currency ?? 'UZS'
  const price = Number.isFinite(values.price) ? Number(values.price) : 0

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Preview">
      <p className="mb-3 text-[13px] font-medium text-muted">Preview</p>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <CategoryIcon category={category} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-fg">{values.name?.trim() || 'New subscription'}</p>
            <p className="text-[13px] text-muted">{getCategoryMeta(category).label}</p>
          </div>
          <StatusBadge status={values.status ?? 'ACTIVE'} />
        </div>
        <p className="mt-6 text-3xl font-semibold tracking-tight tabular-nums text-fg">
          {formatMoney(price, currency)}
          <span className="ml-1 text-sm font-normal text-muted">{FREQUENCY_SUFFIX[frequency]}</span>
        </p>
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-muted">Per year</dt>
            <dd className="font-medium tabular-nums text-fg">
              {formatMoney(getAnnualizedCost(price, frequency), currency)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Started</dt>
            <dd className="font-medium text-fg">{formatDate(values.startDate)}</dd>
          </div>
        </dl>
      </Card>
    </aside>
  )
}

function Segmented({
  options,
  register,
}: {
  options: Array<{ value: string; label: string }>
  register: UseFormRegisterReturn
}) {
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-fg/[0.06] p-1">
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input type="radio" value={option.value} className="peer sr-only" {...register} />
          <span className="block rounded-lg py-2 text-center text-[13px] font-medium text-muted transition-all hover:text-fg peer-checked:bg-surface peer-checked:text-fg peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  )
}

function Field({
  label,
  error,
  as = 'label',
  children,
}: {
  label: string
  error?: string
  as?: 'label' | 'div'
  children: ReactNode
}) {
  const Wrapper = as
  return (
    <Wrapper className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[13px] text-danger">{error}</span>}
    </Wrapper>
  )
}
