import type { Category } from '@/hooks/use-category';
import type { Transaction } from '@/hooks/use-transaction';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts';
import { useCategory } from '@/hooks/use-category';
import { Icon } from './icon';
import { ChartContainer } from './ui/chart';

interface Props {
  className?: string;
  transactions: Array<Transaction>;
  maxItems?: number;
}

interface DataItem extends Category {
  amount: number;
  count: number;
}

export function CategoriesChart({ className, transactions, maxItems }: Props) {
  const { $t, formatNumber } = useIntl();

  const { categories } = useCategory();

  const chartData = useMemo(() => {
    const result = transactions
      .reduce<Array<DataItem>>((result, transaction) => {
        let item = result.find(currentItem => currentItem.id === transaction.category);
        if (!item) {
          const category = categories.find(
            currentCategory => currentCategory.id === transaction.category,
          );
          if (!category) {
            return result;
          }
          item = {
            ...category,
            amount: 0,
            count: 0,
          };
          result.push(item);
        }
        item.amount += Math.abs(transaction.amount);
        item.count++;
        return result;
      }, [])
      .sort((itemA, itemB) => itemB.amount - itemA.amount);
    if (maxItems && result.length > maxItems) {
      const otherItems = result.slice(maxItems - 1);
      result.splice(maxItems - 1, result.length - maxItems + 1, {
        id: 'other',
        name: $t({ id: 'categories.chart.other' }),
        icon: 'EllipsisVertical',
        color: 'neutral',
        ...otherItems.reduce(
          (currentResult, item) => ({
            amount: currentResult.amount + item.amount,
            count: currentResult.count + item.count,
          }),
          {
            amount: 0,
            count: 0,
          },
        ),
      });
    }
    return result;
  }, [transactions, maxItems]);

  return (
    <ChartContainer className={className} config={{}}>
      <BarChart accessibilityLayer data={chartData} layout="vertical">
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="id"
          type="category"
          axisLine={false}
          tickLine={false}
          width={24}
          tick={({ payload: { value }, y }: { payload: { value: string }; y: number }) => {
            const item = chartData.find(currentItem => currentItem.id === value)!;
            return (
              <foreignObject x={0} y={y - 10} width={20} height={20}>
                <Icon className="size-5 text-muted-foreground" name={item.icon} />
              </foreignObject>
            );
          }}
        />
        <Bar dataKey="amount" layout="vertical" radius={4}>
          <LabelList
            dataKey="id"
            position="insideLeft"
            fill="var(--color-foreground)"
            formatter={(value: string) => {
              const item = chartData.find(currentItem => currentItem.id === value)!;
              const formattedAmount = formatNumber(item.amount, { format: 'currency' });
              return `${formattedAmount} (${item.count})`.replaceAll(' ', '\u00A0');
            }}
          />
          {chartData.map(item => (
            <Cell key={item.id} fill={`var(--color-${item.color}-500)`} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
