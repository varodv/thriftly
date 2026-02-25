'use client';

import type { PropsWithChildren } from 'react';
import type { Category } from '@/hooks/use-category';
import { createContext } from 'react';
import { useStorage } from '@/hooks/use-storage';

export const CategoryContext = createContext<ReturnType<typeof useStorage<Array<Category>>>>([
  [],
  () => {},
]);

export function CategoryProvider({ children }: PropsWithChildren) {
  const value = useStorage<Array<Category>>('thriftly:categories', []);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}
