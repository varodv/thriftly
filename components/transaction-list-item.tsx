import type { Transaction } from '@/hooks/use-transaction';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useCategory } from '@/hooks/use-category';
import { useLongClick } from '@/hooks/use-long-click';
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

  const { stopPropagationHandlers, ...clickHandlers } = useLongClick({
    onClick: () => onUpdate?.(),
    onLongClick: () => setMenuOpen(true),
  });

  const category = categories.find(
    currentCategory => currentCategory.id === transaction.category,
  );

  return (
    <>
      <div
        className={cn(
          'relative flex items-center gap-3 p-3 border first:rounded-t-lg last:rounded-b-lg',
          'bg-accent/50 hover:bg-accent/75 transition-colors cursor-pointer',
          { 'bg-accent': menuOpen },
          className,
        )}
        {...clickHandlers}
      >
        <div
          className={cn(
            'p-2 rounded-md text-white shadow-sm',
            `bg-${category?.color ?? 'neutral'}-500`,
          )}
        >
          <Icon className="size-5" name={category?.icon ?? 'circle-question-mark'} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium truncate">{category?.name ?? transaction.category}</span>
          {transaction.tags.length > 0 && (
            <span className="text-muted-foreground text-xs truncate">
              {transaction.tags.join(', ')}
            </span>
          )}
        </div>
        <span
          className={cn(
            'shrink-0 ml-auto font-bold',
            transaction.amount > 0 ? 'text-green-500' : 'text-red-500',
          )}
        >
          {transaction.amount > 0 && '+'}
          <FormattedNumber value={transaction.amount} format="currency" />
        </span>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40">
            <DropdownMenuItem
              {...stopPropagationHandlers}
              onClick={(event) => {
                onUpdate?.();
                setMenuOpen(false);
                event.stopPropagation();
              }}
            >
              <PencilIcon />
              {$t({ id: 'transaction.list.item.actions.update' })}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              {...stopPropagationHandlers}
              onClick={(event) => {
                setDeleteDialogOpen(true);
                setMenuOpen(false);
                event.stopPropagation();
              }}
            >
              <TrashIcon />
              {$t({ id: 'transaction.list.item.actions.delete' })}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
