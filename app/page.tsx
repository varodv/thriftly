'use client';

import type { Category } from '@/hooks/use-category';
import type { Transaction } from '@/hooks/use-transaction';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { BalanceCard } from '@/components/balance-card';
import { CategoryDialog } from '@/components/category-dialog';
import { TransactionDialog } from '@/components/transaction-dialog';
import { TransactionList } from '@/components/transaction-list';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useCategory } from '@/hooks/use-category';
import { useTransaction } from '@/hooks/use-transaction';

export default function Page() {
  const { $t } = useIntl();

  const { transactions, createTransaction, updateTransaction, deleteTransaction }
    = useTransaction();

  const { updateCategory } = useCategory();

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  useEffect(() => {
    if (!transactionDialogOpen) {
      setSelectedTransaction(undefined);
    }
  }, [transactionDialogOpen]);

  useEffect(() => {
    if (selectedTransaction) {
      setTransactionDialogOpen(true);
    }
  }, [selectedTransaction]);

  useEffect(() => {
    if (!categoryDialogOpen) {
      setSelectedCategory(undefined);
    }
  }, [categoryDialogOpen]);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryDialogOpen(true);
    }
  }, [selectedCategory]);

  function onTransactionDialogSubmit(
    transaction: Omit<Transaction, 'id'> & Partial<Pick<Transaction, 'id'>>,
  ) {
    if (transaction.id) {
      updateTransaction(transaction as Transaction);
      toast.success($t({ id: 'transaction.toast.update.success' }));
    }
    else {
      createTransaction(transaction);
      toast.success($t({ id: 'transaction.toast.create.success' }));
    }
    setTransactionDialogOpen(false);
  }

  function onTransactionDelete(transaction: Transaction) {
    deleteTransaction(transaction.id);
    toast.success($t({ id: 'transaction.toast.delete.success' }));
  }

  function onCategoryDialogSubmit(category: Omit<Category, 'id'> & Partial<Pick<Category, 'id'>>) {
    updateCategory(category as Category);
    toast.success($t({ id: 'category.toast.update.success' }));
    setCategoryDialogOpen(false);
  }

  return (
    <>
      <main className="flex flex-col gap-3 h-full py-4">
        <div className="flex items-center justify-between mx-4">
          <h1 className="mx-auto text-3xl font-bold">thriftly</h1>
        </div>
        <BalanceCard className="mx-4" transactions={transactions} />
        <TransactionList
          className="flex-1 px-4"
          transactions={transactions}
          onUpdate={setSelectedTransaction}
          onDelete={onTransactionDelete}
          onCategoryUpdate={setSelectedCategory}
        />
        <TransactionDialog
          open={transactionDialogOpen}
          transaction={selectedTransaction}
          onOpenChange={setTransactionDialogOpen}
          onSubmit={onTransactionDialogSubmit}
        />
        <CategoryDialog
          open={categoryDialogOpen}
          category={selectedCategory}
          onOpenChange={setCategoryDialogOpen}
          onSubmit={onCategoryDialogSubmit}
        />
        <div className="flex items-center justify-between mx-4">
          <Button className="mx-auto" size="icon" onClick={() => setTransactionDialogOpen(true)}>
            <PlusIcon />
          </Button>
        </div>
      </main>
      <Toaster position="top-center" />
    </>
  );
}
