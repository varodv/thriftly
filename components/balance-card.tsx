import type { ChartConfig } from './ui/chart';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from 'recharts';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer } from './ui/chart';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
}

interface DataItem {
  date: Date;
  income: number;
  expense: number;
}

export function BalanceCard({ className, transactions }: Props) {
  const { $t } = useIntl();

  const { formatDate } = useDate();

  const config: ChartConfig = {
    income: {
      color: 'var(--color-green-500)',
    },
    expense: {
      color: 'var(--color-red-500)',
    },
  };

  const [open, setOpen] = useState(false);

  const balance = useMemo(
    () => transactions.reduce((result, transaction) => result + transaction.amount, 0),
    [transactions],
  );

  const data = useMemo(
    () =>
      transactions
        .reduce<Array<DataItem>>((result, transaction) => {
          const date = new Date(transaction.timestamp);
          date.setDate(1);
          date.setHours(0, 0, 0, 0);
          let item = result.find(currentItem => currentItem.date.getTime() === date.getTime());
          if (!item) {
            item = {
              date,
              income: 0,
              expense: 0,
            };
            result.push(item);
          }
          if (transaction.amount > 0) {
            item.income += transaction.amount;
          }
          else {
            item.expense -= transaction.amount;
          }
          return result;
        }, [])
        .slice(-6),
    [transactions],
  );

  const activeIndex = useMemo(() => data.findIndex(item => isThisMonth(item.date)), [data]);

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
                  'text-2xl font-bold',
                  balance > 0 ? 'text-green-500' : 'text-red-500',
                )}
              >
                {balance > 0 && '+'}
                <FormattedNumber value={balance} format="currency" />
              </CardTitle>
              <CardDescription>
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
                className={cn('size-4 transition-transform', { 'rotate-180': open })}
              />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0">
            <ChartContainer config={config}>
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value: Date) => formatDate(value, { month: 'short' })}
                />
                <Bar
                  dataKey="income"
                  fill="var(--color-income)"
                  radius={4}
                  activeIndex={activeIndex}
                  activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke="var(--color-income)"
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    );
                  }}
                />
                <Bar
                  dataKey="expense"
                  fill="var(--color-expense)"
                  radius={4}
                  activeIndex={activeIndex}
                  activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke="var(--color-expense)"
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    );
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
