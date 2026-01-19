import { useEffect, useState } from 'react';

export function useStorage<ValueType>(key: string, initialValue: ValueType) {
  const [value, setValue] = useState(initialValue);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storageValue = localStorage.getItem(key);
    if (storageValue !== null) {
      setValue(JSON.parse(storageValue) as ValueType);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, initialized]);

  return [value, setValue] as const;
}
