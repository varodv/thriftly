import type { ReactNode } from 'react';
import type { CarouselApi } from './ui/carousel';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfMonth } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDate } from '@/hooks/use-date';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  renderItem: (props: ItemProps) => ReactNode;
}

interface ItemProps {
  transactions: Array<Transaction>;
}

export function TransactionCarousel({ className, transactions, renderItem }: Props) {
  const { formatDate } = useDate();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const items = useMemo(() => {
    const result: Array<{ date: Date; transactions: Array<Transaction> }> = [];

    if (!transactions.length) {
      result.push({
        date: startOfMonth(new Date()),
        transactions: [],
      });
      return result;
    }

    const [minTimestamp, maxTimestamp] = transactions.reduce(
      (currentResult, transaction) => {
        if (transaction.timestamp < currentResult[0]) {
          currentResult[0] = transaction.timestamp;
        }
        if (transaction.timestamp > currentResult[1]) {
          currentResult[1] = transaction.timestamp;
        }
        return currentResult;
      },
      [transactions[0].timestamp, Date.now()],
    );

    const currentMonth = startOfMonth(new Date(minTimestamp));
    while (currentMonth.getTime() <= maxTimestamp) {
      result.push({
        date: new Date(currentMonth),
        transactions: transactions.filter((transaction) => {
          const transactionMonth = startOfMonth(transaction.timestamp);
          return transactionMonth.getTime() === currentMonth.getTime();
        }),
      });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    return result;
  }, [transactions]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={!api?.canScrollPrev()}
          onClick={() => api?.scrollPrev()}
        >
          <ArrowLeftIcon />
        </Button>
        <Select
          value={items[current - 1]?.date.toISOString() ?? null}
          onValueChange={(newValue) => {
            const newIndex = items.findIndex(item => item.date.toISOString() === newValue);
            api?.scrollTo(newIndex);
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {[...items].reverse().map(item => (
              <SelectItem key={item.date.toISOString()} value={item.date.toISOString()}>
                {formatDate(item.date, { year: 'numeric', month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={!api?.canScrollNext()}
          onClick={() => api?.scrollNext()}
        >
          <ArrowRightIcon />
        </Button>
      </div>
      <Carousel
        opts={{
          startIndex: items.findIndex(item => isThisMonth(item.date)),
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map(item => (
            <CarouselItem key={item.date.toISOString()}>
              {renderItem({ transactions: item.transactions })}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
