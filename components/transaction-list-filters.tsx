import type { Transaction, TransactionFilters } from '@/hooks/use-transaction';
import { cn } from '@/lib/utils';
import { CategoriesFilter } from './categories-filter';
import { PeriodFilter } from './period-filter';
import { TagsFilter } from './tags-filter';

interface Props {
  className?: string;
  value: TransactionFilters;
  transactions: Array<Transaction>;
  onChange?: (value: TransactionFilters) => void;
}

export function TransactionListFilters({ className, value, transactions, onChange }: Props) {
  return (
    <div className={cn('flex items-center gap-3 overflow-x-auto py-3', className)}>
      <PeriodFilter value={value} transactions={transactions} onChange={onChange} />
      <CategoriesFilter value={value} transactions={transactions} onChange={onChange} />
      <TagsFilter value={value} transactions={transactions} onChange={onChange} />
    </div>
  );
}
