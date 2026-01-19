export type Entity<Type extends Record<string, any>> = Type & { id: string };

export function createEntity<Type extends Entity<Record<string, any>>>(payload: Omit<Type, 'id'>) {
  return {
    ...payload,
    id: crypto.randomUUID(),
  } as Type;
}
