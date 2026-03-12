import type { Dispatch, SetStateAction } from 'react';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfDay, startOfMonth } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormattedNumber } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { BalanceChart } from './balance-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  openState?: [boolean, Dispatch<SetStateAction<boolean>>];
}

const CHART_MONTHS = 6;

export function BalanceCard({ className, transactions, openState }: Props) {
  const { formatDate } = useDate();

  const [open, setOpen] = openState ?? useState(false);

  const currentBalance = useMemo(
    () =>
      transactions.reduce((result, transaction) => {
        if (isThisMonth(transaction.timestamp)) {
          result += transaction.amount;
        }
        return result;
      }, 0),
    [transactions],
  );

  const chartTransactions = useMemo(() => {
    const minDate = startOfMonth(new Date());
    minDate.setMonth(minDate.getMonth() - (CHART_MONTHS - 1));
    return transactions.filter(transaction => transaction.timestamp >= minDate.getTime());
  }, [transactions]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={cn('gap-3 p-3', className)}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-3',
              transactions.length ? 'cursor-pointer' : 'pointer-events-none',
            )}
          >
            <CardHeader className="flex-1 p-0">
              <CardTitle
                className={cn(
                  'text-2xl font-bold whitespace-nowrap',
                  currentBalance > 0 ? 'text-green-500' : 'text-red-500',
                )}
              >
                {currentBalance > 0 && '+'}
                <FormattedNumber value={currentBalance} format="currency" />
              </CardTitle>
              <CardDescription className="truncate">
                {formatDate(startOfMonth(new Date()), {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
                {new Date().getDate() > 1 && (
                  <>
                    {' - '}
                    {formatDate(startOfDay(new Date()), {
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            {!!chartTransactions.length && (
              <ChevronDownIcon
                className={cn('size-4 m-2 transition-transform duration-300', {
                  'rotate-180': open,
                })}
              />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0">
            <BalanceChart transactions={chartTransactions} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
