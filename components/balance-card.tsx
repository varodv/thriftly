import type { Transaction } from '@/hooks/use-transaction';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { CashFlowChart } from './cash-flow-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
}

export function BalanceCard({ className, transactions }: Props) {
  const { $t } = useIntl();

  const { formatDate } = useDate();

  const [open, setOpen] = useState(false);

  const balance = useMemo(
    () => transactions.reduce((result, transaction) => result + transaction.amount, 0),
    [transactions],
  );

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
                  balance > 0 ? 'text-green-500' : 'text-red-500',
                )}
              >
                {balance > 0 && '+'}
                <FormattedNumber value={balance} format="currency" />
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
            <CashFlowChart transactions={transactions} maxItems={6} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
