import type { Transaction } from '@/hooks/use-transaction';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { TransactionListGroup } from './transaction-list-group';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  onSelect?: (transaction: Transaction) => void;
}

const PAGE_SIZE = 10;

export function TransactionList({ className, transactions, onSelect }: Props) {
  const { $t } = useIntl();

  const { formatDate } = useDate();

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
    <div className={cn('flex flex-col gap-4 overflow-y-auto', className)}>
      {visibleGroups.map(group => (
        <TransactionListGroup
          key={group.date.toISOString()}
          title={formatDate(group.date)}
          transactions={group.transactions}
          onSelect={onSelect}
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
  );
}
