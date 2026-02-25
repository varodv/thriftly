import type { Transaction, TransactionFilters } from '@/hooks/use-transaction';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { useTransaction } from '@/hooks/use-transaction';
import { cn } from '@/lib/utils';
import { TransactionListFilters } from './transaction-list-filters';
import { TransactionListGroup } from './transaction-list-group';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  onUpdate?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

const PAGE_SIZE = 10;

export function TransactionList({ className, transactions, onUpdate, onDelete }: Props) {
  const { $t, formatNumber } = useIntl();

  const { formatDate } = useDate();

  const { filterTransactions } = useTransaction();

  const listRef = useRef<HTMLDivElement>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<TransactionFilters>({});

  const [visiblePages, setVisiblePages] = useState(1);

  const filteredTransactions = useMemo(
    () => filterTransactions(filters, transactions),
    [transactions, filters],
  );

  const visibleTransactions = useMemo(
    () =>
      filteredTransactions
        .sort((transactionA, transactionB) => transactionB.timestamp - transactionA.timestamp)
        .slice(0, visiblePages * PAGE_SIZE),
    [filteredTransactions, visiblePages],
  );

  const visibleGroups = useMemo(
    () =>
      visibleTransactions.reduce<Array<{ date: Date; transactions: Array<Transaction> }>>(
        (result, transaction) => {
          const date = new Date(transaction.timestamp);
          date.setHours(0, 0, 0, 0);
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
    [visibleTransactions],
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
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisiblePages(prev => prev + 1);
      }
    });
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [transactions.length]);

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
          <span className="text-muted-foreground">
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
          <div className="flex gap-2 ml-auto font-bold">
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
      <div ref={listRef} className="flex flex-col flex-1 gap-6 overflow-y-auto">
        {visibleGroups.map(group => (
          <TransactionListGroup
            key={group.date.toISOString()}
            title={formatDate(group.date)}
            transactions={group.transactions}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
        {visibleTransactions.length < filteredTransactions.length
          ? (
              <div ref={observerTarget} />
            )
          : (
              <span className="pt-2 pb-8 text-muted-foreground text-sm text-center">
                {!filteredTransactions.length
                  ? $t({ id: 'transaction.list.empty' })
                  : $t({ id: 'transaction.list.end' })}
              </span>
            )}
      </div>
    </div>
  );
}
