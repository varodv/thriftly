import type { Entity } from '@/lib/entity';
import { useCallback } from 'react';
import { createEntity } from '@/lib/entity';
import { useStorage } from './use-storage';

export type Category = Entity<{
  name: string;
  icon: string;
  color: string;
}>;

export function useCategory() {
  const [categories, setCategories] = useStorage<Array<Category>>('thriftly:categories', []);

  const createCategory = useCallback((payload: Omit<Category, 'id'>) => {
    const newCategory = createEntity(payload);
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((payload: Category) => {
    setCategories(prev =>
      prev.map(category => (category.id === payload.id ? payload : category)),
    );
  }, []);

  const deleteCategory = useCallback((id: Category['id']) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  }, []);

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
