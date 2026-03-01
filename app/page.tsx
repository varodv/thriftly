'use client';

import type { Transaction } from '@/hooks/use-transaction';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { BalanceCard } from '@/components/balance-card';
import { TransactionDialog } from '@/components/transaction-dialog';
import { TransactionList } from '@/components/transaction-list';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useTransaction } from '@/hooks/use-transaction';

export default function Page() {
  const { $t } = useIntl();

  const { transactions, createTransaction, updateTransaction, deleteTransaction }
    = useTransaction();

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

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

  return (
    <>
      <main className="flex flex-col gap-3 h-full p-4">
        <h1 className="self-center text-3xl font-bold">thriftly</h1>
        <BalanceCard transactions={transactions} />
        <TransactionList
          className="flex-1"
          transactions={transactions}
          onUpdate={setSelectedTransaction}
          onDelete={onTransactionDelete}
        />
        <TransactionDialog
          open={transactionDialogOpen}
          transaction={selectedTransaction}
          onOpenChange={setTransactionDialogOpen}
          onSubmit={onTransactionDialogSubmit}
        />
        <Button className="self-center" size="icon" onClick={() => setTransactionDialogOpen(true)}>
          <PlusIcon />
        </Button>
      </main>
      <Toaster position="top-center" />
    </>
  );
}
