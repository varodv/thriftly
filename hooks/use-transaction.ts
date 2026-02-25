import type { Category } from './use-category';
import type { Entity } from '@/lib/entity';
import { useCallback, useContext } from 'react';
import { TransactionContext } from '@/context/transaction-context';
import { createEntity } from '@/lib/entity';

export type Transaction = Entity<{
  amount: number;
  timestamp: number;
  category: Category['id'];
  tags: Array<string>;
}>;

export interface TransactionFilters {
  categories?: Array<Category['id']>;
  tags?: Array<string>;
}

export function useTransaction() {
  const [transactions, setTransactions] = useContext(TransactionContext);

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

  function filterTransactions(filters: TransactionFilters, array = transactions) {
    return array.filter((transaction) => {
      if (filters.categories?.length && !filters.categories.includes(transaction.category)) {
        return false;
      }
      if (filters.tags?.length && !filters.tags.some(tag => transaction.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }

  return {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    filterTransactions,
  };
}
