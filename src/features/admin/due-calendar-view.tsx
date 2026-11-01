import { useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import type { DatesSetArg, EventClickArg, EventContentArg, EventMountArg } from '@fullcalendar/core'
import { useNavigate } from 'react-router-dom'
import { calculateVisibleRange, toCalendarEvents } from '@/features/admin/due-calendar'
import type { PaymentDue, VisibleRange } from '@/features/admin/types'

interface DueCalendarViewProps {
  entries: PaymentDue[]
  today: string | undefined
  onRangeChange: (range: VisibleRange) => void
}

const PHONE_QUERY = '(max-width: 639px)'

function readExtendedText(info: { event: { extendedProps: Record<string, unknown> } }, key: string) {
  const value = info.event.extendedProps[key]
  return typeof value === 'string' ? value : ''
}

function renderEventContent(info: EventContentArg) {
  return (
    <span className="block truncate">
      <strong className="font-semibold">{readExtendedText(info, 'shortLabel')}</strong> {info.event.title}
    </span>
  )
}

function describeEvent(info: EventMountArg) {
  info.el.setAttribute('title', `${readExtendedText(info, 'toneLabel')}: ${info.event.title}`)
}

export function DueCalendarView({ entries, today, onRangeChange }: DueCalendarViewProps) {
  const navigate = useNavigate()
  const events = useMemo(() => toCalendarEvents(entries), [entries])
  const initialView = useMemo(() => (window.matchMedia(PHONE_QUERY).matches ? 'listMonth' : 'dayGridMonth'), [])

  const handleDatesSet = (info: DatesSetArg) => onRangeChange(calculateVisibleRange(info.start, info.end))

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault()
    const userId = info.event.extendedProps.userId
    if (typeof userId === 'number') navigate(`/admin/users/${userId}`)
  }

  return (
    <div className="due-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin]}
        initialView={initialView}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek,listMonth' }}
        buttonText={{ today: 'Today', month: 'Month', week: 'Week', list: 'List' }}
        timeZone="UTC"
        now={today}
        firstDay={1}
        height="auto"
        dayMaxEvents={3}
        eventDisplay="block"
        eventInteractive
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventDidMount={describeEvent}
        datesSet={handleDatesSet}
        noEventsContent="No payments due in this range"
      />
    </div>
  )
}
