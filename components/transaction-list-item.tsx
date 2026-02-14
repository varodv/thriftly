import type { MouseEventHandler } from 'react';
import type { Transaction } from '@/hooks/use-transaction';
import { FormattedNumber } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

interface Props {
  className?: string;
  transaction: Transaction;
  onClick?: MouseEventHandler;
}

export function TransactionListItem({ className, transaction, onClick }: Props) {
  const { categories } = useCategory();

  const category = categories.find(
    currentCategory => currentCategory.id === transaction.category,
  );

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 border rounded-lg',
        'bg-card hover:bg-accent/50 transition-colors cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'p-2 rounded-full text-white shadow-sm',
          `bg-${category?.color ?? 'neutral'}-500`,
        )}
      >
        <Icon className="size-5" name={category?.icon ?? 'circle-question-mark'} />
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{category?.name ?? transaction.category}</span>
        {transaction.tags.length > 0 && (
          <span className="text-muted-foreground text-xs">{transaction.tags.join(', ')}</span>
        )}
      </div>
      <span
        className={cn(
          'ml-auto font-bold',
          transaction.amount > 0 ? 'text-green-500' : 'text-red-500',
        )}
      >
        {transaction.amount > 0 && '+'}
        <FormattedNumber value={transaction.amount} format="currency" />
      </span>
    </div>
  );
}
