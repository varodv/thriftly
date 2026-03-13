import type { ChartConfig } from './ui/chart';
import type { Transaction } from '@/hooks/use-transaction';
import { isThisMonth, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Bar, ComposedChart, Label, Rectangle, ReferenceLine, XAxis, YAxis } from 'recharts';
import { useDate } from '@/hooks/use-date';
import { ChartContainer } from './ui/chart';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  net?: boolean;
}

interface DataItem {
  date: Date;
  income: number;
  expense: number;
  net: number;
}

type ChartDataItem = Omit<DataItem, 'net'>;

export function CashFlowChart({ className, transactions, net }: Props) {
  const { formatNumber } = useIntl();

  const { formatDate } = useDate();

  const chartConfig: ChartConfig = {
    expense: {
      color: 'var(--color-red-500)',
    },
    income: {
      color: 'var(--color-green-500)',
    },
  };

  const data = useMemo(
    () =>
      transactions.reduce<Array<DataItem>>((result, transaction) => {
        const date = startOfMonth(transaction.timestamp);
        let item = result.find(currentItem => currentItem.date.getTime() === date.getTime());
        if (!item) {
          item = {
            date,
            income: 0,
            expense: 0,
            net: 0,
          };
          result.push(item);
        }
        if (transaction.amount > 0) {
          item.income += transaction.amount;
        }
        else {
          item.expense += transaction.amount;
        }
        item.net += transaction.amount;
        return result;
      }, []),
    [transactions],
  );

  const chartData = useMemo(
    () =>
      data.map<ChartDataItem>((item) => {
        let income: number, expense: number;
        if (net) {
          if (item.net > 0) {
            income = item.net;
            expense = 0;
          }
          else {
            income = 0;
            expense = item.net;
          }
        }
        else {
          income = item.income;
          expense = item.expense;
        }
        return {
          date: item.date,
          income,
          expense,
        };
      }),
    [net, data],
  );

  const chartDomain = useMemo(() => {
    const maxValue = Math.max(
      ...data.reduce<Array<number>>(
        (result, item) => [...result, item.income, Math.abs(item.expense)],
        [],
      ),
    );
    const maxDomain = Math.ceil(maxValue / 100) * 100;
    return [-maxDomain, maxDomain];
  }, [data]);

  const chartActiveIndex = useMemo(() => data.findIndex(item => isThisMonth(item.date)), [data]);

  const meanData = useMemo(() => {
    const { income, expense, net, count } = data.reduce(
      (result, item) => {
        if (!isThisMonth(item.date)) {
          result.income += item.income;
          result.expense += item.expense;
          result.net += item.net;
          result.count++;
        }
        return result;
      },
      {
        income: 0,
        expense: 0,
        net: 0,
        count: 0,
      },
    );
    return {
      income: income / count,
      expense: expense / count,
      net: net / count,
    };
  }, [data]);

  return (
    <ChartContainer className={className} config={chartConfig}>
      <ComposedChart accessibilityLayer data={chartData} stackOffset="sign" margin={{ top: 16 }}>
        <ReferenceLine y={0} />
        <ReferenceLine y={chartDomain[0]} />
        <ReferenceLine y={chartDomain[1]} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: Date) => formatDate(value, { month: 'short' })}
        />
        <YAxis type="number" domain={chartDomain} hide />
        {Object.keys(chartConfig).map(key => (
          <Bar
            key={key}
            dataKey={key}
            stackId="date"
            fill={chartConfig[key].color}
            radius={[4, 4, 0, 0]}
            activeIndex={chartActiveIndex}
            activeBar={({ ...props }) => {
              return (
                <Rectangle
                  {...props}
                  stroke={chartConfig[key].color}
                  fillOpacity={0.6}
                  strokeDasharray={4}
                />
              );
            }}
          />
        ))}
        {!!net && (
          <ReferenceLine y={meanData.net} stroke="var(--color-foreground)" strokeDasharray={4}>
            <Label
              value={
                (meanData.net > 0 ? '+' : '') + formatNumber(meanData.net, { format: 'currency' })
              }
              position="insideBottomRight"
              fill="var(--color-foreground)"
            />
          </ReferenceLine>
        )}
        {!net && (
          <ReferenceLine y={meanData.income} stroke="var(--color-foreground)" strokeDasharray={4}>
            <Label
              value={formatNumber(meanData.income, { format: 'currency' })}
              position="insideBottomRight"
              fill="var(--color-foreground)"
            />
          </ReferenceLine>
        )}
        {!net && (
          <ReferenceLine y={meanData.expense} stroke="var(--color-foreground)" strokeDasharray={4}>
            <Label
              value={formatNumber(Math.abs(meanData.expense), { format: 'currency' })}
              position="insideBottomRight"
              fill="var(--color-foreground)"
            />
          </ReferenceLine>
        )}
      </ComposedChart>
    </ChartContainer>
  );
}
