import type { Dispatch, SetStateAction } from 'react';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfMonth } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { CategoriesChart } from './categories-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  openState?: [boolean, Dispatch<SetStateAction<boolean>>];
}

export function CategoriesCard({ className, transactions, openState }: Props) {
  const { $t } = useIntl();

  const { formatDate } = useDate();

  const [open, setOpen] = openState ?? useState(false);

  const currentTransactions = useMemo(
    () => transactions.filter(transaction => isThisMonth(transaction.timestamp)),
    [transactions],
  );

  return (
    <Collapsible className="h-full" open={open} onOpenChange={setOpen}>
      <Card className={cn('gap-3 h-full p-3', className)}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-3',
              currentTransactions.length ? 'cursor-pointer' : 'pointer-events-none',
            )}
          >
            <CardHeader className="flex-1 p-0">
              <CardTitle className="text-2xl font-bold whitespace-nowrap">
                {$t({ id: 'categories.card.title' }, { count: currentTransactions.length })}
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
            {!!currentTransactions.length && (
              <ChevronDownIcon
                className={cn('size-4 m-2 transition-transform duration-300', {
                  'rotate-180': open,
                })}
              />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="my-auto">
          <CardContent className="p-0">
            <CategoriesChart transactions={currentTransactions} maxItems={6} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
