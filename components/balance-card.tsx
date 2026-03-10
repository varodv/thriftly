import type { Dispatch, SetStateAction } from 'react';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfMonth } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { BalanceChart } from './balance-chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  openState?: [boolean, Dispatch<SetStateAction<boolean>>];
}

const CHART_MONTHS = 6;

export function BalanceCard({ className, transactions, openState }: Props) {
  const { $t } = useIntl();

  const { formatDate } = useDate();

  const [open, setOpen] = openState ?? useState(false);

  const totalalance = useMemo(
    () => transactions.reduce((result, transaction) => result + transaction.amount, 0),
    [transactions],
  );

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

  const meanBalance = useMemo(() => {
    const { total, months } = chartTransactions.reduce(
      (result, item) => {
        if (!isThisMonth(item.timestamp)) {
          result.total += item.amount;
          const month = startOfMonth(item.timestamp);
          if (!result.months.some(currentMonth => currentMonth.getTime() === month.getTime())) {
            result.months.push(month);
          }
        }
        return result;
      },
      { total: 0, months: [] as Array<Date> },
    );
    return total / months.length;
  }, [chartTransactions]);

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
                  totalalance > 0 ? 'text-green-500' : 'text-red-500',
                )}
              >
                {totalalance > 0 && '+'}
                <FormattedNumber value={totalalance} format="currency" />
              </CardTitle>
              <CardDescription className="truncate">
                {$t(
                  { id: 'balance.card.description' },
                  {
                    date: formatDate(
                      transactions.length ? new Date(transactions[0].timestamp) : new Date(),
                    ),
                  },
                )}
              </CardDescription>
            </CardHeader>
            {!!transactions.length && (
              <ChevronDownIcon
                className={cn('size-4 m-2 transition-transform', { 'rotate-180': open })}
              />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0">
            <BalanceChart transactions={chartTransactions} />
          </CardContent>
          <CardFooter className="flex-col items-start p-0 text-sm">
            <span className="truncate">
              <FormattedMessage
                id="balance.card.current"
                values={{
                  value: (
                    <span
                      className={cn(
                        'font-bold',
                        currentBalance > 0 ? 'text-green-500' : 'text-red-500',
                      )}
                    >
                      {currentBalance > 0 && '+'}
                      <FormattedNumber value={currentBalance} format="currency" />
                    </span>
                  ),
                }}
              />
            </span>
            <span className="truncate">
              <FormattedMessage
                id="balance.card.mean"
                values={{
                  value: (
                    <span
                      className={cn(
                        'font-bold',
                        meanBalance > 0 ? 'text-green-500' : 'text-red-500',
                      )}
                    >
                      {meanBalance > 0 && '+'}
                      <FormattedNumber value={meanBalance} format="currency" />
                    </span>
                  ),
                  months: CHART_MONTHS - 1,
                }}
              />
            </span>
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
