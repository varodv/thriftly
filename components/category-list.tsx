import type { Transaction } from '@/hooks/use-transaction';
import { useMemo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
}

export function CategoryList({ className, transactions }: Props) {
  const { categories } = useCategory();

  const items = useMemo(
    () =>
      categories
        .map((category) => {
          const categoryTransactions = transactions.filter(
            transaction => transaction.category === category.id,
          );

          const amount = categoryTransactions.reduce(
            (result, transaction) => result + transaction.amount,
            0,
          );

          return {
            ...category,
            amount,
            transactions: categoryTransactions,
          };
        })
        .sort((itemA, itemB) => itemB.amount - itemA.amount),
    [categories, transactions],
  );

  return (
    <div
      className={cn(
        className,
        'flex flex-col gap-3 overflow-y-auto h-full min-h-0 py-3 px-4 -mx-4',
      )}
    >
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-accent/50">
          <div className={cn('p-2 rounded-md text-white shadow-sm', `bg-${item.color}-500`)}>
            <Icon className="size-5" name={item.icon} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium truncate">{item.name}</span>
            <span className="text-muted-foreground text-xs truncate">
              <FormattedMessage
                id="transaction.list.count"
                values={{ count: item.transactions.length }}
              />
            </span>
          </div>
          <span
            className={cn(
              'shrink-0 ml-auto font-bold',
              item.amount > 0 ? 'text-green-500' : 'text-red-500',
            )}
          >
            <FormattedNumber value={Math.abs(item.amount)} format="currency" />
          </span>
        </div>
      ))}
    </div>
  );
}
