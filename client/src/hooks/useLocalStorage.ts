import { useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
  session = false
): [T, (value: T | ((value: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = session
        ? window.sessionStorage.getItem(key)
        : window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (e) {
      console.log(e);
      return initialValue;
    }
  });

  const setValue = (value: T | ((value: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (session)
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      else window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.log(e);
    }
  };

  return [storedValue, setValue];
}
