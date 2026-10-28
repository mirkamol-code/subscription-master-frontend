import { api } from '@/api/client'
import type { ExchangeRatesResponse } from '@/types/api'

export const currenciesApi = {
  rates: async () => (await api.get<ExchangeRatesResponse>('/currencies/rates')).data,
}
