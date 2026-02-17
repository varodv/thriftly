import type { Transaction } from '@/hooks/use-transaction';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Props {
  className?: string;
  transaction: Transaction;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function TransactionListItem({ className, transaction, onUpdate, onDelete }: Props) {
  const { $t } = useIntl();

  const { categories } = useCategory();

  const [menuOpen, setMenuOpen] = useState(false);

  const category = categories.find(
    currentCategory => currentCategory.id === transaction.category,
  );

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'flex items-center gap-3 p-3 border rounded-lg',
            'bg-card hover:bg-accent/50 transition-colors cursor-pointer',
            { 'bg-accent/75': menuOpen },
            className,
          )}
        >
          <div
            className={cn(
              'p-2 rounded-full text-white shadow-sm',
              `bg-${category?.color ?? 'neutral'}-500`,
            )}
          >
            <Icon className="size-5" name={category?.icon ?? 'circle-question-mark'} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{category?.name ?? transaction.category}</span>
            {transaction.tags.length > 0 && (
              <span className="text-muted-foreground text-xs">{transaction.tags.join(', ')}</span>
            )}
          </div>
          <span
            className={cn(
              'ml-auto font-bold',
              transaction.amount > 0 ? 'text-green-500' : 'text-red-500',
            )}
          >
            {transaction.amount > 0 && '+'}
            <FormattedNumber value={transaction.amount} format="currency" />
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40">
        <DropdownMenuItem onClick={() => onUpdate?.()}>
          <PencilIcon />
          {$t({ id: 'transaction.list.item.update' })}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete?.()}>
          <TrashIcon />
          {$t({ id: 'transaction.list.item.delete' })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
