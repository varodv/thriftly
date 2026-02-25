'use client';

import type { PropsWithChildren } from 'react';
import type { Transaction } from '@/hooks/use-transaction';
import { createContext } from 'react';
import { useStorage } from '@/hooks/use-storage';

export const TransactionContext = createContext<ReturnType<typeof useStorage<Array<Transaction>>>>([
  [],
  () => {},
]);

export function TransactionProvider({ children }: PropsWithChildren) {
  const value = useStorage<Array<Transaction>>('thriftly:transactions', []);

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}
