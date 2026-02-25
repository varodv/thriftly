import type { Transaction, TransactionFilters } from '@/hooks/use-transaction';
import { TagsIcon } from 'lucide-react';
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
  value: string;
  label: string;
  count: number;
}

const ALL_VALUE = '';

const MAX_OPTIONS_TRIGGER = 2;

export function TagsFilter({ className, value, transactions, onChange }: Props) {
  const { $t, formatNumber } = useIntl();

  const { filterTransactions } = useTransaction();

  const options = useMemo(
    () =>
      transactions
        .reduce<Array<Option>>(
          (result, transaction) => {
            transaction.tags.forEach((tag) => {
              if (!result.some(currentOption => currentOption.value === tag)) {
                const count = filterTransactions({ tags: [tag] }, transactions).length;
                result.push({
                  value: tag,
                  label: tag,
                  count,
                });
              }
            });
            return result;
          },
          [
            {
              value: ALL_VALUE,
              label: $t({ id: 'transaction.list.filter.tags.all' }),
              count: transactions.length,
            },
          ],
        )
        .sort((optionA, optionB) => optionB.count - optionA.count),
    [transactions],
  );

  const valueOptions = useMemo(() => {
    if (!value.tags?.length || value.tags.length === options.length - 1) {
      return [options[0]];
    }
    return value.tags.map(tag => options.find(option => option.value === tag)!);
  }, [value.tags, options]);

  function onValueOptionsChange(newValueOptions: Array<Option>) {
    if (
      newValueOptions[newValueOptions.length - 1]?.value === ALL_VALUE
      || newValueOptions.length === options.length - 1
    ) {
      onChange?.({ ...value, tags: [] });
    }
    else {
      onChange?.({
        ...value,
        tags: newValueOptions
          .filter(option => option.value !== ALL_VALUE)
          .map(option => option.value),
      });
    }
  }

  return (
    <Combobox
      value={valueOptions}
      multiple
      items={options}
      autoHighlight
      disabled={!options.length}
      onValueChange={onValueOptionsChange}
    >
      <ComboboxTrigger
        render={(
          <Button variant="outline" size="sm" className={cn('rounded-full', className)}>
            {!!value.tags?.length && <TagsIcon />}
            {valueOptions.slice(0, MAX_OPTIONS_TRIGGER).map((option, index) => (
              <span key={option.value}>
                {option.label}
                {index < valueOptions.length - 1 && ','}
              </span>
            ))}
            {valueOptions.length > MAX_OPTIONS_TRIGGER && (
              <span className="text-muted-foreground text-xs">
                (+
                {formatNumber(valueOptions.length - MAX_OPTIONS_TRIGGER)}
                )
              </span>
            )}
          </Button>
        )}
      />
      <ComboboxContent className="min-w-50">
        <ComboboxList>
          {(option: Option) => (
            <ComboboxItem key={option.value} className="gap-2" value={option}>
              <span className="truncate">{option.label}</span>
              <span className="ml-auto text-muted-foreground text-xs">
                (
                {formatNumber(option.count)}
                )
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
