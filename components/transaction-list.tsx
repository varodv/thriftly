import type { Category } from '@/hooks/use-category';
import type { Transaction, TransactionFilters } from '@/hooks/use-transaction';
import { startOfDay } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { useTransaction } from '@/hooks/use-transaction';
import { cn } from '@/lib/utils';
import { TransactionListFilters } from './transaction-list-filters';
import { TransactionListGroup } from './transaction-list-group';
import { Button } from './ui/button';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  onCreate?: () => void;
  onUpdate?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onCategoryUpdate?: (category: Category) => void;
  onScroll?: () => void;
}

export function TransactionList({
  className,
  transactions,
  onCreate,
  onUpdate,
  onDelete,
  onCategoryUpdate,
  onScroll,
}: Props) {
  const { $t, formatNumber } = useIntl();

  const { formatDate } = useDate();

  const { filterTransactions } = useTransaction();

  const listRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<TransactionFilters>({});

  const filteredTransactions = useMemo(
    () => filterTransactions(filters, transactions),
    [transactions, filters],
  );

  const transactionGroups = useMemo(
    () =>
      filteredTransactions
        .reverse()
        .sort((transactionA, transactionB) => transactionB.timestamp - transactionA.timestamp)
        .reduce<Array<{ date: Date; transactions: Array<Transaction> }>>(
          (result, transaction) => {
            const date = startOfDay(transaction.timestamp);
            let group = result.find(currentGroup => currentGroup.date.getTime() === date.getTime());
            if (!group) {
              group = {
                date,
                transactions: [],
              };
              result.push(group);
            }
            group.transactions.push(transaction);
            return result;
          },
          [],
        ),
    [filteredTransactions],
  );

  const income = useMemo(
    () =>
      filteredTransactions.reduce((result, transaction) => {
        if (transaction.amount > 0) {
          result += transaction.amount;
        }
        return result;
      }, 0),
    [filteredTransactions],
  );

  const expense = useMemo(
    () =>
      filteredTransactions.reduce((result, transaction) => {
        if (transaction.amount < 0) {
          result += transaction.amount;
        }
        return result;
      }, 0),
    [filteredTransactions],
  );

  useEffect(() => {
    resetScroll();
  }, [transactions, filters]);

  function resetScroll(behavior?: ScrollBehavior) {
    listRef.current?.scrollTo({ top: 0, behavior });
  }

  return (
    <div className={cn('flex flex-col overflow-hidden', className)}>
      <TransactionListFilters value={filters} transactions={transactions} onChange={setFilters} />
      {!!filteredTransactions.length && (
        <div
          className="flex items-center gap-3 p-3 text-sm cursor-pointer"
          onClick={() => resetScroll('smooth')}
        >
          <span className="text-muted-foreground truncate">
            {filteredTransactions.length < transactions.length
              ? $t(
                  { id: 'transaction.list.count.filtered' },
                  {
                    filtered: formatNumber(filteredTransactions.length),
                    count: formatNumber(transactions.length),
                  },
                )
              : $t(
                  { id: 'transaction.list.count' },
                  {
                    count: formatNumber(transactions.length),
                  },
                )}
          </span>
          <div className="flex gap-2 shrink-0 ml-auto font-bold">
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
      )}
      <div
        ref={listRef}
        className="flex flex-col flex-1 gap-6 overflow-y-auto px-4 -mx-4"
        onScroll={onScroll}
      >
        {transactionGroups.map(group => (
          <TransactionListGroup
            key={group.date.toISOString()}
            title={formatDate(group.date)}
            transactions={group.transactions}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onCategoryUpdate={onCategoryUpdate}
          />
        ))}
        {!filteredTransactions.length
          ? (
              <span className="py-8 text-muted-foreground text-sm text-center">
                {$t({ id: 'transaction.list.empty' })}
              </span>
            )
          : (
              <span
                className="py-2 text-muted-foreground text-sm text-center cursor-pointer"
                onClick={() => resetScroll('smooth')}
              >
                {$t({ id: 'transaction.list.end' })}
              </span>
            )}
        <Button
          className="sticky z-20 bottom-0 mt-auto mx-auto"
          size="icon"
          onClick={() => onCreate?.()}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
