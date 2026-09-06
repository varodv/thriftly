import type { Category } from '@/hooks/use-category';
import type { Transaction } from '@/hooks/use-transaction';
import { startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { useTransaction } from '@/hooks/use-transaction';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  onUpdate?: (category: Category) => void;
}

interface ItemProps extends Item {
  className?: string;
  onUpdate?: () => void;
}

interface Item extends Category {
  transactions: Array<Transaction>;
  amount: number;
  compareAmount: number;
}

type ItemChartProps = Pick<ItemProps, 'className' | 'amount' | 'compareAmount'>;

export function CategoryList({ className, transactions, onUpdate }: Props) {
  const { categories } = useCategory();
  const { transactions: allTransactions } = useTransaction();

  const items = useMemo(
    () =>
      categories
        .map<Item>((category) => {
          const categoryTransactions = transactions.filter(
            transaction => transaction.category === category.id,
          );

          const amount = categoryTransactions.reduce(
            (result, transaction) => result + transaction.amount,
            0,
          );

          const minTimestamp = allTransactions.reduce((result, transaction) => {
            if (transaction.timestamp < result) {
              result = transaction.timestamp;
            }
            return result;
          }, Date.now());

          const monthlyAmounts: Array<number> = [];
          const currentMonth = startOfMonth(new Date(minTimestamp));
          while (currentMonth.getTime() < startOfMonth(new Date()).getTime()) {
            const monthlyAmount = allTransactions.reduce((result, transaction) => {
              const transactionMonth = startOfMonth(transaction.timestamp);
              if (
                transaction.category === category.id
                && transactionMonth.getTime() === currentMonth.getTime()
              ) {
                result += transaction.amount;
              }
              return result;
            }, 0);
            monthlyAmounts.push(monthlyAmount);
            currentMonth.setMonth(currentMonth.getMonth() + 1);
          }

          const compareAmount = monthlyAmounts.length
            ? monthlyAmounts.reduce((result, monthlyAmount) => result + monthlyAmount, 0)
            / monthlyAmounts.length
            : 0;

          return {
            ...category,
            transactions: categoryTransactions,
            amount,
            compareAmount,
          };
        })
        .sort(
          (itemA, itemB) =>
            Math.max(Math.abs(itemB.amount), Math.abs(itemB.compareAmount))
            - Math.max(Math.abs(itemA.amount), Math.abs(itemA.compareAmount)),
        ),
    [categories, transactions, allTransactions],
  );

  return (
    <div className={cn(className, 'flex flex-col gap-3 overflow-y-auto h-full min-h-0 px-4 -mx-4')}>
      {items.map(item => (
        <CategoryListItem key={item.id} {...item} onUpdate={() => onUpdate?.(item)} />
      ))}
    </div>
  );
}

function CategoryListItem({
  className,
  name,
  icon,
  color,
  transactions,
  amount,
  compareAmount,
  onUpdate,
}: ItemProps) {
  return (
    <div
      className={cn(
        className,
        'flex flex-col gap-3 p-3 border rounded-lg',
        'bg-accent/50 hover:bg-accent/75 transition-colors cursor-pointer',
      )}
      onClick={() => onUpdate?.()}
    >
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-md text-white shadow-sm', `bg-${color}-500`)}>
          <Icon className="size-5" name={icon} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium truncate">{name}</span>
          <span className="text-muted-foreground text-xs truncate">
            <FormattedMessage id="transaction.list.count" values={{ count: transactions.length }} />
          </span>
        </div>
        <div className="flex flex-col items-end ml-auto">
          <span className={cn('font-bold', amount > 0 ? 'text-green-500' : 'text-red-500')}>
            <FormattedNumber value={Math.abs(amount)} format="currency" />
          </span>
          <span className="text-muted-foreground text-xs">
            <FormattedNumber value={amount - compareAmount} format="currency" />
          </span>
        </div>
      </div>
      <CategoryListItemChart amount={amount} compareAmount={compareAmount} />
    </div>
  );
}

function CategoryListItemChart({ className, amount, compareAmount }: ItemChartProps) {
  return (
    <div
      className={cn(
        className,
        'relative flex h-1 rounded-full',
        compareAmount > 0 ? 'bg-green-500/30' : 'bg-red-500/30',
      )}
    >
      <span
        className={cn('rounded-full', compareAmount > 0 ? 'bg-green-500' : 'bg-red-500')}
        style={{ width: `${Math.min((Math.abs(amount) / Math.abs(compareAmount)) * 100, 100)}%` }}
      />
      {Math.abs(amount) > Math.abs(compareAmount) && (
        <span
          className="absolute -top-0.5 h-2 w-0.5 bg-primary"
          style={{ left: `${Math.min((Math.abs(compareAmount) / Math.abs(amount)) * 100, 100)}%` }}
        />
      )}
    </div>
  );
}
