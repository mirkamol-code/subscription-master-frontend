import { describe, expect, it } from 'vitest'
import {
  canDownloadReport,
  REPORT_COLUMNS,
  selectAllReportColumns,
  toggleReportColumn,
  toReportColumnsParam,
} from '@/features/reports/report-columns'

describe('report columns', () => {
  it('starts with every column selected', () => {
    // when
    const selected = selectAllReportColumns()

    // then
    expect(selected).toHaveLength(10)
    expect(canDownloadReport(selected)).toBe(true)
  })

  it('offers the columns the server allows, with readable labels', () => {
    // then
    expect(REPORT_COLUMNS.map((column) => column.key)).toEqual([
      'SERVICE',
      'CATEGORY',
      'STATUS',
      'BILLING',
      'PRICE',
      'CURRENCY',
      'YEARLY_COST',
      'YEARLY_COST_UZS',
      'STARTED',
      'NEXT_PAYMENT',
    ])
    expect(REPORT_COLUMNS[7].label).toBe('Yearly cost (UZS)')
  })

  it('blocks the download once every column is unticked', () => {
    // given
    let selected = selectAllReportColumns()

    // when
    for (const column of REPORT_COLUMNS) selected = toggleReportColumn(selected, column.key)

    // then
    expect(selected).toEqual([])
    expect(canDownloadReport(selected)).toBe(false)
  })

  it('sends ticked columns in report order, whatever order they were ticked in', () => {
    // given
    const selected = toggleReportColumn(toggleReportColumn([], 'NEXT_PAYMENT'), 'SERVICE')

    // when
    const param = toReportColumnsParam(selected)

    // then
    expect(param).toBe('SERVICE,NEXT_PAYMENT')
  })
})
