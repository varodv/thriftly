import type { Transaction, TransactionFilters } from '@/hooks/use-transaction';
import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useTransaction } from '@/hooks/use-transaction';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from './ui/combobox';

interface Props {
  className?: string;
  value: TransactionFilters;
  transactions: Array<Transaction>;
  onChange?: (value: TransactionFilters) => void;
}

interface Option {
  value: (typeof OPTION_VALUES)[number];
  label: string;
  count: number;
  period: [start: Date | undefined, end: Date | undefined];
}

const OPTION_VALUES = ['all', 'week', 'month', 'year'] as const;

export function PeriodFilter({ className, value, transactions, onChange }: Props) {
  const { $t, formatNumber } = useIntl();

  const { filterTransactions } = useTransaction();

  const options = useMemo(() => {
    return OPTION_VALUES.map<Option>((optionValue) => {
      const period = getOptionPeriod(optionValue);
      const count = filterTransactions(
        { ...value, startDate: period[0], endDate: period[1] },
        transactions,
      ).length;
      return {
        value: optionValue,
        label: $t({ id: `transaction.list.filter.period.${optionValue}` }),
        count,
        period,
      };
    });
  }, [value, transactions]);

  const valueOption = useMemo(
    () =>
      options.find(
        option =>
          option.period[0]?.getTime() === value.startDate?.getTime()
          && option.period[1]?.getTime() === value.endDate?.getTime(),
      )!,
    [value.startDate, value.endDate, options],
  );

  function onValueOptionChange(newValueOption: Option | null) {
    onChange?.({
      ...value,
      startDate: newValueOption?.period[0],
      endDate: newValueOption?.period[1],
    });
  }

  function getOptionPeriod(optionValue: Option['value']): Option['period'] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (optionValue) {
      case 'all':
        return [undefined, undefined];
      case 'week': {
        return [startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 })];
      }
      case 'month': {
        return [startOfMonth(today), endOfMonth(today)];
      }
      case 'year': {
        return [startOfYear(today), endOfYear(today)];
      }
    }
  }

  return (
    <Combobox value={valueOption} items={options} onValueChange={onValueOptionChange}>
      <ComboboxTrigger
        render={(
          <Button className={cn('rounded-full', className)} variant="outline" size="sm">
            {valueOption.value !== OPTION_VALUES[0] && <CalendarIcon />}
            {valueOption.label}
          </Button>
        )}
      />
      <ComboboxContent className="min-w-50">
        <ComboboxList>
          {options.map(option => (
            <ComboboxItem key={option.value} className="gap-2" value={option}>
              <span className="truncate">{option.label}</span>
              <span className="ml-auto text-muted-foreground text-xs">
                (
                {formatNumber(option.count)}
                )
              </span>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
