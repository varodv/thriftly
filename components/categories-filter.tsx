import type { Transaction, TransactionFilters } from '@/hooks/use-transaction';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { useTransaction } from '@/hooks/use-transaction';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
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
  icon?: string;
  color?: string;
  count: number;
}

const ALL_VALUE = '';

const MAX_OPTIONS_TRIGGER = 2;

export function CategoriesFilter({ className, value, transactions, onChange }: Props) {
  const { $t, formatNumber } = useIntl();

  const { filterTransactions } = useTransaction();

  const { categories } = useCategory();

  const options = useMemo(
    () =>
      transactions
        .reduce<Array<Option>>(
          (result, transaction) => {
            if (!result.some(currentOption => currentOption.value === transaction.category)) {
              const category = categories.find(
                currentCategory => currentCategory.id === transaction.category,
              );
              const count = filterTransactions(
                { ...value, categories: [transaction.category] },
                transactions,
              ).length;
              result.push({
                value: transaction.category,
                label: category?.name ?? transaction.category,
                icon: category?.icon,
                color: category?.color,
                count,
              });
            }
            return result;
          },
          [
            {
              value: ALL_VALUE,
              label: $t({ id: 'transaction.list.filter.categories.all' }),
              count: filterTransactions({ ...value, categories: [] }, transactions).length,
            },
          ],
        )
        .sort((optionA, optionB) => optionB.count - optionA.count),
    [value, transactions, categories],
  );

  const valueOptions = useMemo(() => {
    if (!value.categories?.length || value.categories.length === options.length - 1) {
      return [options[0]];
    }
    return value.categories.map(category => options.find(option => option.value === category)!);
  }, [value.categories, options]);

  function onValueOptionsChange(newValueOptions: Array<Option>) {
    if (
      newValueOptions[newValueOptions.length - 1]?.value === ALL_VALUE
      || newValueOptions.length === options.length - 1
    ) {
      onChange?.({ ...value, categories: [] });
    }
    else {
      onChange?.({
        ...value,
        categories: newValueOptions
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
            {valueOptions.slice(0, MAX_OPTIONS_TRIGGER).map((option, index) => (
              <div key={option.value} className="flex items-center gap-2">
                {option.icon && <Icon className={`text-${option.color}-500`} name={option.icon} />}
                <span>
                  {option.label}
                  {index < valueOptions.length - 1 && ','}
                </span>
              </div>
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
              {option.icon && <Icon className={`text-${option.color}-500`} name={option.icon} />}
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
