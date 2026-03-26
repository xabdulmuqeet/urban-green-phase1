"use client";

import { useEffect, useState } from "react";

type SetValue<T> = T | ((current: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValueState] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        setValueState(JSON.parse(storedValue) as T);
      }
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  const setValue = (nextValue: SetValue<T>) => {
    setValueState((currentValue) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (current: T) => T)(currentValue)
          : nextValue;

      window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      return resolvedValue;
    });
  };

  return { value, setValue, isHydrated };
}
