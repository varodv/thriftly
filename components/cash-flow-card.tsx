import type { Dispatch, SetStateAction } from 'react';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfMonth } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { CashFlowChart } from './cash-flow-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Field, FieldLabel } from './ui/field';
import { Switch } from './ui/switch';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  openState?: [boolean, Dispatch<SetStateAction<boolean>>];
}

export function CashFlowCard({ className, transactions, openState }: Props) {
  const { $t } = useIntl();

  const { formatDate } = useDate();

  const [open, setOpen] = openState ?? useState(false);

  const [net, setNet] = useState(true);

  const currentData = useMemo(
    () =>
      transactions.reduce(
        (result, transaction) => {
          if (isThisMonth(transaction.timestamp)) {
            if (transaction.amount > 0) {
              result.income += transaction.amount;
            }
            else {
              result.expense += Math.abs(transaction.amount);
            }
            result.net += transaction.amount;
          }
          return result;
        },
        {
          income: 0,
          expense: 0,
          net: 0,
        },
      ),
    [transactions],
  );

  const chartTransactions = useMemo(() => {
    const minDate = startOfMonth(new Date());
    minDate.setMonth(minDate.getMonth() - 6);
    return transactions.filter(transaction => transaction.timestamp >= minDate.getTime());
  }, [transactions]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={cn('gap-3 p-3', className)}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-3',
              chartTransactions.length ? 'cursor-pointer' : 'pointer-events-none',
            )}
          >
            <CardHeader className="flex-1 p-0">
              <CardTitle className="text-2xl font-bold whitespace-nowrap">
                {net
                  ? (
                      <span className={currentData.net > 0 ? 'text-green-500' : 'text-red-500'}>
                        {currentData.net > 0 && '+'}
                        <FormattedNumber value={currentData.net} format="currency" />
                      </span>
                    )
                  : (
                      <>
                        <span className="text-green-500">
                          <FormattedNumber value={currentData.income} format="currency" />
                        </span>
                        {' - '}
                        <span className="text-red-500">
                          <FormattedNumber value={currentData.expense} format="currency" />
                        </span>
                      </>
                    )}
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
                    {formatDate(new Date(), {
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
          <CardContent className="flex flex-col gap-2 p-0">
            <CashFlowChart transactions={chartTransactions} net={net} />
            <Field orientation="horizontal">
              <Switch id="cash-flow-card-net" checked={net} onCheckedChange={setNet} />
              <FieldLabel htmlFor="cash-flow-card-net">
                {$t({ id: 'cash-flow.card.net' })}
              </FieldLabel>
            </Field>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
