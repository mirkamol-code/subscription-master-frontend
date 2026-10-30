import { describe, expect, it } from 'vitest'
import { describeSync } from '@/features/gmail/sync-status'
import type { GmailSyncStatus } from '@/types/api'

function syncStatus(overrides: Partial<GmailSyncStatus>): GmailSyncStatus {
  return { state: 'IDLE', processed: 0, total: 0, lastSyncedAt: null, error: null, ...overrides }
}

describe('describeSync', () => {
  it('shows the progress of a running Sync and keeps polling', () => {
    // given
    const status = syncStatus({ state: 'RUNNING', processed: 40, total: 160 })

    // when
    const sync = describeSync(status)

    // then
    expect(sync).toEqual({
      label: 'Reading your inbox… 40 of 160 emails',
      percent: 25,
      tone: 'neutral',
      isRunning: true,
      shouldPoll: true,
    })
  })

  it('never shows more than 100% when more emails arrive than were counted', () => {
    // given
    const status = syncStatus({ state: 'RUNNING', processed: 170, total: 160 })

    // when
    const sync = describeSync(status)

    // then
    expect(sync.percent).toBe(100)
  })

  it('shows no percent before the Sync has counted the emails', () => {
    // given
    const status = syncStatus({ state: 'RUNNING', processed: 0, total: 0 })

    // when
    const sync = describeSync(status)

    // then
    expect(sync).toMatchObject({ label: 'Reading your inbox…', percent: null, shouldPoll: true })
  })

  it('stops polling once the Sync has finished', () => {
    // given
    const status = syncStatus({ state: 'IDLE', processed: 160, total: 160, lastSyncedAt: '2026-11-08T09:30:00Z' })

    // when
    const sync = describeSync(status)

    // then
    expect(sync).toEqual({
      label: 'Last synced Nov 8, 2026',
      percent: null,
      tone: 'positive',
      isRunning: false,
      shouldPoll: false,
    })
  })

  it('asks the User to reconnect when Gmail access was lost', () => {
    // given
    const status = syncStatus({ state: 'FAILED', error: 'RECONNECT_REQUIRED' })

    // when
    const sync = describeSync(status)

    // then
    expect(sync).toEqual({
      label: 'Gmail stopped giving us access',
      percent: null,
      tone: 'danger',
      isRunning: false,
      shouldPoll: false,
      actionLabel: 'Reconnect Gmail',
    })
  })

  it.each<[string, Partial<GmailSyncStatus>, string, string]>([
    ['a failed Sync', { state: 'FAILED', error: 'SYNC_FAILED' }, 'Sync didn’t finish. Try again', 'danger'],
    [
      'an error the backend adds later',
      { state: 'FAILED', error: 'QUOTA_EXCEEDED' as GmailSyncStatus['error'] },
      'Sync didn’t finish. Try again',
      'danger',
    ],
    [
      'a Sync that skipped some emails',
      { state: 'IDLE', error: 'SOME_EMAILS_FAILED', lastSyncedAt: '2026-11-08T09:30:00Z' },
      'Last synced Nov 8, 2026. Some emails couldn’t be read',
      'warning',
    ],
  ])('describes %s without polling', (_, overrides, label, tone) => {
    // given
    const status = syncStatus(overrides)

    // when
    const sync = describeSync(status)

    // then
    expect(sync).toMatchObject({ label, tone, shouldPoll: false })
  })
})
