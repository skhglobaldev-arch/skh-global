import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parse, isBefore, startOfDay } from 'date-fns';
import { CalendarDays, Clock3, Loader2 } from 'lucide-react';
import {
  BookingSlot,
  getSelectableDates,
  getSlotsForDate,
  isMonThu,
  parseDateString,
  toDateString,
} from './bookingUtils';

import 'react-day-picker/dist/style.css';

export type BookingCalendarLabels = {
  selectDate?: string;
  selectTime?: string;
  noSlots?: string;
  noTimesForDay?: string;
  timezone?: string;
  blockDay?: string;
  available?: string;
  booked?: string;
  hidden?: string;
  clickToToggle?: string;
};

type BookingCalendarProps = {
  mode: 'client' | 'admin';
  slots: BookingSlot[];
  loading?: boolean;
  selectedDate?: string;
  selectedSlotId?: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slotId: string) => void;
  onToggleSlot?: (slot: BookingSlot) => void | Promise<void>;
  onBlockDay?: (date: string) => void | Promise<void>;
  isRtl?: boolean;
  labels?: BookingCalendarLabels;
  className?: string;
};

const defaultLabels: BookingCalendarLabels = {
  selectDate: 'Choose a date',
  selectTime: 'Choose a time',
  noSlots: 'No available dates right now.',
  noTimesForDay: 'No open times on this day.',
  timezone: 'Europe/London',
  blockDay: 'Block entire day',
  available: 'Available',
  booked: 'Booked',
  hidden: 'Blocked',
  clickToToggle: 'Click a slot to block or restore it.',
};

const calendarClassNames = {
  months: 'flex flex-col',
  month: 'space-y-4',
  caption: 'flex items-center justify-center relative mb-4',
  caption_label: 'text-sm font-black uppercase tracking-[0.18em] text-cyan-100',
  nav: 'flex items-center gap-1',
  nav_button:
    'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#050713]/70 text-cyan-200 transition hover:border-cyan-300/35 hover:bg-cyan-300/10',
  nav_button_previous: 'absolute left-1',
  nav_button_next: 'absolute right-1',
  table: 'w-full border-collapse',
  head_row: 'flex',
  head_cell: 'w-10 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500',
  row: 'mt-1 flex w-full',
  cell: 'relative p-0 text-center',
  day: 'mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]',
  day_selected:
    'bg-gradient-to-br from-[#7C3AED] via-[#2563EB] to-[#38D8FF] text-white shadow-[0_0_24px_rgba(56,216,255,0.35)] hover:opacity-95',
  day_today: 'border border-cyan-300/30 text-cyan-100',
  day_disabled: 'opacity-25 hover:bg-transparent cursor-not-allowed',
  day_outside: 'opacity-20',
  day_hidden: 'invisible',
};

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  mode,
  slots,
  loading = false,
  selectedDate = '',
  selectedSlotId = '',
  onSelectDate,
  onSelectSlot,
  onToggleSlot,
  onBlockDay,
  isRtl = false,
  labels: labelOverrides,
  className = '',
}) => {
  const labels = { ...defaultLabels, ...labelOverrides };
  const textAlign = isRtl ? 'text-right' : 'text-left';

  const selectableDateStrings = React.useMemo(
    () => getSelectableDates(slots, mode),
    [slots, mode],
  );

  const selectableDates = React.useMemo(
    () => selectableDateStrings.map((dateStr) => parseDateString(dateStr)),
    [selectableDateStrings],
  );

  const selectedDay = selectedDate ? parseDateString(selectedDate) : undefined;

  const daySlots = selectedDate ? getSlotsForDate(slots, selectedDate, mode) : [];
  const timezone = daySlots[0]?.timezone || slots[0]?.timezone || labels.timezone;

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;
    if (!isMonThu(date)) return true;
    const dateStr = toDateString(date);
    return !selectableDateStrings.includes(dateStr);
  };

  const handleDaySelect = (date?: Date) => {
    if (!date) return;
    onSelectDate(toDateString(date));
  };

  const renderClientSlot = (slot: BookingSlot) => {
    const isSelected = selectedSlotId === slot.id;
    return (
      <button
        key={slot.id}
        type="button"
        onClick={() => onSelectSlot(slot.id)}
        className={`rounded-2xl border px-4 py-3 text-sm font-bold transition-all ${
          isSelected
            ? 'border-cyan-300/55 bg-gradient-to-br from-[#7C3AED]/25 via-[#2563EB]/20 to-[#38D8FF]/20 text-white shadow-[0_0_28px_rgba(56,216,255,0.22)]'
            : 'border-white/10 bg-[#050713]/60 text-slate-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.06]'
        }`}
      >
        {slot.time}
      </button>
    );
  };

  const renderAdminSlot = (slot: BookingSlot) => {
    const status = slot.status || 'Available';
    const isBooked = status === 'Booked';
    const isHidden = status === 'Hidden';
    const isAvailable = status === 'Available';

    return (
      <button
        key={slot.id}
        type="button"
        disabled={isBooked || !onToggleSlot}
        onClick={() => onToggleSlot?.(slot)}
        className={`rounded-2xl border px-4 py-3 text-left transition-all disabled:cursor-not-allowed ${
          isAvailable
            ? 'border-emerald-400/35 bg-emerald-400/[0.08] text-emerald-100 hover:border-emerald-300/55'
            : isBooked
              ? 'border-white/10 bg-white/[0.03] text-slate-500 opacity-70'
              : 'border-red-400/35 bg-red-400/[0.08] text-red-100 line-through hover:border-red-300/55'
        }`}
      >
        <span className="block text-sm font-black">{slot.time}</span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider opacity-80">
          {isAvailable ? labels.available : isBooked ? labels.booked : labels.hidden}
        </span>
      </button>
    );
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="overflow-hidden rounded-[1.35rem] border border-violet-400/14 bg-[#050713]/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl md:p-5">
        <div className={`mb-4 flex items-center gap-2 ${textAlign}`}>
          <CalendarDays className="text-cyan-300" size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            {labels.selectDate}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
            Loading calendar…
          </div>
        ) : selectableDates.length ? (
          <div className="booking-calendar-root flex justify-center">
            <style>{`
              .booking-calendar-root .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: #38D8FF;
                --rdp-background-color: rgba(56, 216, 255, 0.12);
                margin: 0;
                color: #e2e8f0;
              }
              .booking-calendar-root .rdp-day_has_availability:not(.rdp-day_selected):not(.rdp-day_disabled) {
                border: 1px solid rgba(56, 216, 255, 0.22);
                background: rgba(56, 216, 255, 0.06);
                color: #cffafe;
              }
            `}</style>
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={handleDaySelect}
              disabled={isDateDisabled}
              modifiers={{ has_availability: selectableDates }}
              modifiersClassNames={{ has_availability: 'rdp-day_has_availability' }}
              classNames={calendarClassNames}
              showOutsideDays
            />
          </div>
        ) : (
          <p className={`rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-sm text-amber-100 ${textAlign}`}>
            {labels.noSlots}
          </p>
        )}
      </div>

      {selectedDate ? (
        <div className="overflow-hidden rounded-[1.35rem] border border-cyan-300/14 bg-[#101827]/55 p-4 backdrop-blur-xl md:p-5">
          <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${textAlign}`}>
              <Clock3 className="text-cyan-300" size={16} />
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                  {labels.selectTime}
                </span>
                <span className="mt-1 block text-sm font-bold text-white">
                  {format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'EEEE, d MMMM yyyy')}
                </span>
              </div>
            </div>
            {mode === 'admin' && onBlockDay ? (
              <button
                type="button"
                className="rounded-xl border border-red-400/25 bg-red-400/[0.08] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-red-100 transition hover:border-red-300/45"
                onClick={() => onBlockDay(selectedDate)}
              >
                {labels.blockDay}
              </button>
            ) : null}
          </div>

          {daySlots.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {daySlots.map((slot) =>
                mode === 'admin' ? renderAdminSlot(slot) : renderClientSlot(slot),
              )}
            </div>
          ) : (
            <p className={`text-sm text-slate-400 ${textAlign}`}>{labels.noTimesForDay}</p>
          )}

          <p className={`mt-4 text-xs text-slate-500 ${textAlign}`}>
            {mode === 'admin' ? labels.clickToToggle : `${labels.timezone} · ${timezone}`}
          </p>
        </div>
      ) : null}
    </div>
  );
};
