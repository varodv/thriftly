import type { FormatDateOptions } from 'react-intl';
import { isThisWeek, isThisYear, isToday, isTomorrow, isYesterday } from 'date-fns';
import { useIntl } from 'react-intl';

export function useDate() {
  const { $t, formatDate: formatDateIntl } = useIntl();

  function formatDate(value: Date, format?: FormatDateOptions) {
    if (format) {
      return formatDateIntl(value, format);
    }
    if (isToday(value)) {
      return $t({ id: 'date.today' });
    }
    if (isYesterday(value)) {
      return $t({ id: 'date.yesterday' });
    }
    if (isTomorrow(value)) {
      return $t({ id: 'date.tomorrow' });
    }
    if (isThisWeek(value, { weekStartsOn: 1 })) {
      return formatDateIntl(value, { weekday: 'long' });
    }
    if (isThisYear(value)) {
      return formatDateIntl(value, { month: 'short', day: 'numeric', weekday: 'short' });
    }
    return formatDateIntl(value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  }

  return {
    formatDate,
  };
}
