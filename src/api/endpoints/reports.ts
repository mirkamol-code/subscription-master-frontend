import axios from 'axios'
import { api } from '@/api/client'

export type ReportFormat = 'xlsx' | 'csv'

async function replaceBlobErrorBody(error: unknown): Promise<never> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      error.response.data = JSON.parse(await error.response.data.text()) as unknown
    } catch {
      error.response.data = null
    }
  }
  throw error
}

export const reportsApi = {
  downloadAnnual: async (format: ReportFormat, columns: string): Promise<Blob> =>
    (
      await api
        .get<Blob>(`/reports/annual.${format}`, { params: { columns }, responseType: 'blob' })
        .catch(replaceBlobErrorBody)
    ).data,
}
