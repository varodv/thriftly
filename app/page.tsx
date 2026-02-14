'use client';

import type { Transaction } from '@/hooks/use-transaction';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TransactionDialog } from '@/components/transaction-dialog';
import { TransactionList } from '@/components/transaction-list';
import { Button } from '@/components/ui/button';
import { useTransaction } from '@/hooks/use-transaction';

export default function Page() {
  const { transactions, createTransaction, updateTransaction } = useTransaction();

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
    }
    else {
      createTransaction(transaction);
    }
    setTransactionDialogOpen(false);
  }

  return (
    <main className="flex flex-col gap-4 h-full p-4">
      <h1 className="self-center text-3xl font-bold">thriftly</h1>
      <TransactionList
        className="flex-1"
        transactions={transactions}
        onSelect={setSelectedTransaction}
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
  );
}
