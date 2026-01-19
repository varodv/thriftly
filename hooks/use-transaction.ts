import type { Category } from './use-category';
import type { Entity } from '@/lib/entity';
import { useCallback } from 'react';
import { createEntity } from '@/lib/entity';
import { useStorage } from './use-storage';

export type Transaction = Entity<{
  amount: number;
  date: Date;
  category: Category['id'];
  tags: Array<string>;
}>;

export function useTransaction() {
  const [transactions, setTransactions] = useStorage<Array<Transaction>>(
    'thriftly:transactions',
    [],
  );

  const createTransaction = useCallback((payload: Omit<Transaction, 'id'>) => {
    const newTransaction = createEntity(payload);
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((payload: Transaction) => {
    setTransactions(prev =>
      prev.map(transaction => (transaction.id === payload.id ? payload : transaction)),
    );
  }, []);

  const deleteTransaction = useCallback((id: Transaction['id']) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  }, []);

  return {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
