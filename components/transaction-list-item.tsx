import type { Transaction } from '@/hooks/use-transaction';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const category = categories.find(
    currentCategory => currentCategory.id === transaction.category,
  );

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-3 p-3 border first:rounded-t-lg last:rounded-b-lg',
              'bg-accent/50 hover:bg-accent/75 transition-colors cursor-pointer',
              { 'bg-accent': menuOpen },
              className,
            )}
          >
            <div
              className={cn(
                'p-2 rounded-md text-white shadow-sm',
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
            {$t({ id: 'transaction.list.item.actions.update' })}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <TrashIcon />
            {$t({ id: 'transaction.list.item.actions.delete' })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{$t({ id: 'transaction.delete.dialog.title' })}</AlertDialogTitle>
            <AlertDialogDescription>
              {$t({ id: 'transaction.delete.dialog.description' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">
              {$t({ id: 'transaction.delete.dialog.actions.cancel' })}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => onDelete?.()}>
              {$t({ id: 'transaction.delete.dialog.actions.delete' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
