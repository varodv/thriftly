import type { Transaction } from '@/hooks/use-transaction';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
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

  const listRef = useRef<HTMLDivElement>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const [visiblePages, setVisiblePages] = useState(1);

  const visibleTransactions = useMemo(
    () =>
      transactions
        .sort((transactionA, transactionB) => transactionB.timestamp - transactionA.timestamp)
        .slice(0, visiblePages * PAGE_SIZE),
    [transactions, visiblePages],
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
      transactions.reduce((result, transaction) => {
        if (transaction.amount > 0) {
          result += transaction.amount;
        }
        return result;
      }, 0),
    [transactions],
  );

  const expense = useMemo(
    () =>
      transactions.reduce((result, transaction) => {
        if (transaction.amount < 0) {
          result += transaction.amount;
        }
        return result;
      }, 0),
    [transactions],
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

  return (
    <div className={cn('flex flex-col overflow-hidden', className)}>
      {!!transactions.length && (
        <div
          className="flex items-center gap-3 p-3 text-sm cursor-pointer"
          onClick={() => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="text-muted-foreground">
            {$t({ id: 'transaction.list.count' }, { count: formatNumber(transactions.length) })}
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
        {visibleTransactions.length < transactions.length
          ? (
              <div ref={observerTarget} />
            )
          : !transactions.length
              ? (
                  <span className="py-8 text-muted-foreground text-sm text-center">
                    {$t({ id: 'transaction.list.empty' })}
                  </span>
                )
              : (
                  <span className="py-2 text-muted-foreground text-sm text-center">
                    {$t({ id: 'transaction.list.end' })}
                  </span>
                )}
      </div>
    </div>
  );
}
