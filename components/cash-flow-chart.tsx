import type { ChartConfig } from './ui/chart';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from 'recharts';
import { useDate } from '@/hooks/use-date';
import { ChartContainer } from './ui/chart';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  maxItems?: number;
}

interface DataItem {
  date: Date;
  income: number;
  expense: number;
}

export function CashFlowChart({ className, transactions, maxItems = 0 }: Props) {
  const { formatNumber } = useIntl();

  const { formatDate } = useDate();

  const config: ChartConfig = {
    income: {
      color: 'var(--color-green-500)',
    },
    expense: {
      color: 'var(--color-red-500)',
    },
  };

  const data = useMemo(
    () =>
      transactions
        .reduce<Array<DataItem>>((result, transaction) => {
          const date = startOfMonth(transaction.timestamp);
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
        .slice(-maxItems),
    [transactions, maxItems],
  );

  const meanIncome = useMemo(() => {
    const { total, count } = data.reduce(
      (result, item) => {
        if (!isThisMonth(item.date)) {
          result.total += item.income;
          result.count++;
        }
        return result;
      },
      { total: 0, count: 0 },
    );
    return total / count;
  }, [data]);

  const meanExpense = useMemo(() => {
    const { total, count } = data.reduce(
      (result, item) => {
        if (!isThisMonth(item.date)) {
          result.total += item.expense;
          result.count++;
        }
        return result;
      },
      { total: 0, count: 0 },
    );
    return total / count;
  }, [data]);

  const activeIndex = useMemo(() => data.findIndex(item => isThisMonth(item.date)), [data]);

  return (
    <ChartContainer className={className} config={config}>
      <ComposedChart accessibilityLayer data={data} margin={{ top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
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
                fillOpacity={0.75}
                stroke="var(--color-income)"
                strokeDasharray={4}
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
                fillOpacity={0.75}
                stroke="var(--color-expense)"
                strokeDasharray={4}
              />
            );
          }}
        />
        <ReferenceLine y={meanIncome} stroke="var(--color-income)" strokeDasharray={4}>
          <Label
            value={formatNumber(meanIncome, { format: 'currency' })}
            position="insideBottomRight"
            fill="var(--color-foreground)"
          />
        </ReferenceLine>
        <ReferenceLine y={meanExpense} stroke="var(--color-expense)" strokeDasharray={4}>
          <Label
            value={formatNumber(meanExpense, { format: 'currency' })}
            position="insideBottomRight"
            fill="var(--color-foreground)"
          />
        </ReferenceLine>
      </ComposedChart>
    </ChartContainer>
  );
}
