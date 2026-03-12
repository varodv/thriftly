import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  Bar,
  CartesianGrid,
  Cell,
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
}

interface DataItem {
  date: Date;
  value: number;
}

export function BalanceChart({ className, transactions }: Props) {
  const { formatNumber } = useIntl();

  const { formatDate } = useDate();

  const data = useMemo(
    () =>
      transactions.reduce<Array<DataItem>>((result, transaction) => {
        const date = startOfMonth(transaction.timestamp);
        let item = result.find(currentItem => currentItem.date.getTime() === date.getTime());
        if (!item) {
          item = {
            date,
            value: 0,
          };
          result.push(item);
        }
        item.value += transaction.amount;
        return result;
      }, []),
    [transactions],
  );

  const mean = useMemo(() => {
    const { total, count } = data.reduce(
      (result, item) => {
        if (!isThisMonth(item.date)) {
          result.total += item.value;
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
    <ChartContainer className={className} config={{}}>
      <ComposedChart accessibilityLayer data={data} margin={{ top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: Date) => formatDate(value, { month: 'short' })}
        />
        <Bar
          dataKey="value"
          radius={4}
          activeIndex={activeIndex}
          activeBar={({ ...props }) => {
            return <Rectangle {...props} fillOpacity={0.6} strokeDasharray={4} />;
          }}
        >
          {data.map((item) => {
            const color = item.value > 0 ? 'var(--color-green-500)' : 'var(--color-red-500)';
            return <Cell key={item.date.toString()} fill={color} stroke={color} />;
          })}
        </Bar>
        <ReferenceLine y={mean} stroke="var(--color-foreground)" strokeDasharray={4}>
          <Label
            value={(mean > 0 ? '+' : '') + formatNumber(mean, { format: 'currency' })}
            position="insideBottomRight"
            fill="var(--color-foreground)"
          />
        </ReferenceLine>
      </ComposedChart>
    </ChartContainer>
  );
}
