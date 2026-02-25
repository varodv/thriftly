import type { Transaction, TransactionFilters } from '@/hooks/use-transaction';
import { CategoriesFilter } from './categories-filter';
import { TagsFilter } from './tags-filter';

interface Props {
  value: TransactionFilters;
  transactions: Array<Transaction>;
  onChange?: (value: TransactionFilters) => void;
}

export function TransactionListFilters({ value, transactions, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto p-3">
      <CategoriesFilter value={value} transactions={transactions} onChange={onChange} />
      <TagsFilter value={value} transactions={transactions} onChange={onChange} />
    </div>
  );
}
