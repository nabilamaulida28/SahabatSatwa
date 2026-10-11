import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CareSchedule, ScheduleCategory } from '../../types'
import { monthName, parseDate, toDateStr, todayStr } from '../../lib/date'

interface ScheduleCalendarProps {
  schedules: CareSchedule[]
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const DOT_COLOR: Record<ScheduleCategory, string> = {
  Vaksin: 'bg-[#8B5CF6]',
  Obat: 'bg-[#E11D48]',
  Grooming: 'bg-[#21845F]',
  Pemeriksaan: 'bg-[#D97706]',
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules,
  selectedDate,
  onSelectDate,
}) => {
  const today = todayStr()
  const initial = parseDate(selectedDate || today)
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() })

  const byDate = useMemo(() => {
    const map = new Map<string, CareSchedule[]>()
    for (const s of (schedules || [])) {
      if (!s || !s.date) continue
      const arr = map.get(s.date) ?? []
      arr.push(s)
      map.set(s.date, arr)
    }
    return map
  }, [schedules])

  // Sel kalender: padding awal + hari dalam bulan
  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1)
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
    const out: (string | null)[] = Array(first.getDay()).fill(null)
    for (let d = 1; d <= daysInMonth; d++) out.push(toDateStr(new Date(cursor.year, cursor.month, d)))
    while (out.length % 7 !== 0) out.push(null)
    return out
  }, [cursor])

  const shift = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })

  const goToday = () => {
    const d = new Date()
    setCursor({ year: d.getFullYear(), month: d.getMonth() })
    onSelectDate(today)
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E9E4DC] p-4 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-[#24312C]">
          {monthName(cursor.month)} {cursor.year}
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E6F3E7] text-[#21845F] hover:bg-[#21845F] hover:text-white transition-colors cursor-pointer"
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Bulan sebelumnya"
            className="p-1.5 rounded-xl border border-[#E9E4DC] text-[#718078] hover:bg-[#FAF6EF] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Bulan berikutnya"
            className="p-1.5 rounded-xl border border-[#E9E4DC] text-[#718078] hover:bg-[#FAF6EF] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[11px] font-bold text-[#718078] py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} className="aspect-square" />
          const items = byDate.get(date) ?? []
          const isToday = date === today
          const isSelected = date === selectedDate
          const hasOverdue = items.some((s) => s && s.status === 'Terlewat')
          const categories = Array.from(new Set(items.map((s) => s?.category).filter(Boolean))) as ScheduleCategory[]

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : date)}
              aria-label={`${date}${items.length ? `, ${items.length} jadwal` : ''}`}
              aria-pressed={isSelected}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#21845F] text-white border-[#21845F]'
                  : isToday
                  ? 'bg-[#E6F3E7] text-[#21845F] border-[#21845F]/40'
                  : 'bg-[#FAF6EF]/60 text-[#24312C] border-transparent hover:border-[#E9E4DC] hover:bg-[#FAF6EF]'
              }`}
            >
              <span>{Number(date.slice(8))}</span>
              <span className="flex items-center gap-0.5 h-1.5">
                {categories.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : hasOverdue ? 'bg-[#E11D48]' : (DOT_COLOR[c] || 'bg-[#21845F]')
                    }`}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 pt-3 border-t border-[#E9E4DC] text-[11px] text-[#718078]">
        {(Object.keys(DOT_COLOR) as ScheduleCategory[]).map((c) => (
          <span key={c} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${DOT_COLOR[c]}`} />
            {c}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
          Ada yang terlewat
        </span>
      </div>
    </div>
  )
}
