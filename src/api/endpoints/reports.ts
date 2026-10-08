import { api } from '@/api/client'

export async function downloadAnnualReport(format: 'csv' | 'xlsx') {
  const response = await api.get<Blob>(`/reports/annual.${format}`, { responseType: 'blob' })
  const href = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = href
  link.download = `subscription-master-annual.${format}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(href)
}

