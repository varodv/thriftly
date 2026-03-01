import type { Transaction } from '@/hooks/use-transaction';
import { FormattedNumber } from 'react-intl';
import { cn } from '@/lib/utils';
import { TransactionListItem } from './transaction-list-item';

interface Props {
  className?: string;
  title: string;
  transactions: Array<Transaction>;
  onUpdate?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionListGroup({
  className,
  title,
  transactions,
  onUpdate,
  onDelete,
}: Props) {
  const income = transactions.reduce((result, transaction) => {
    if (transaction.amount > 0) {
      result += transaction.amount;
    }
    return result;
  }, 0);

  const expense = transactions.reduce((result, transaction) => {
    if (transaction.amount < 0) {
      result += transaction.amount;
    }
    return result;
  }, 0);

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className={cn(
          'sticky z-10 top-0 flex items-center gap-3 p-3',
          'bg-linear-to-t from-background/50 to-background backdrop-blur-xs',
        )}
      >
        <span className="flex items-center gap-2 capitalize">
          {title}
          <span className="text-muted-foreground text-xs">
            (
            <FormattedNumber value={transactions.length} />
            )
          </span>
        </span>
        <div className="flex gap-2 ml-auto font-bold text-sm">
          {income > 0 && (
            <span className="text-green-500">
              +
              <FormattedNumber value={income} format="currency" />
            </span>
          )}
          {expense < 0 && (
            <span className="text-red-500">
              <FormattedNumber value={expense} format="currency" />
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        {transactions.map(transaction => (
          <TransactionListItem
            key={transaction.id}
            transaction={transaction}
            onUpdate={() => onUpdate?.(transaction)}
            onDelete={() => onDelete?.(transaction)}
          />
        ))}
      </div>
    </div>
  );
}
