import { storage } from "./mmkv";

// Define the type for the custom hook with a generic parameter
type UseStorage<T> = {
  getLocalStorage: () => T | null;
  setLocalStorage: (data: T) => void;
  deleteLocalStorage: () => void;
  purgeLocalStorage: () => void;
};

const useStorage = <T>(key: string): UseStorage<T> => {
  // Getter
  const getLocalStorage = (): T | null => {
    try {
      const item = storage.getString(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error getting data from Storage:", error);
      return null;
    }
  };

  // Setter
  const setLocalStorage = (data: T): void => {
    try {
      storage.set(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error setting data in localStorage:", error);
    }
  };

  // Deleter
  const deleteLocalStorage = (): void => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error("Error deleting data from localStorage:", error);
    }
  };
  //Delete all the keys.
  const purgeLocalStorage = (): void => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error(
        "Error deleting all the key data from localStorage:",
        error
      );
    }
  };

  return {
    getLocalStorage,
    setLocalStorage,
    deleteLocalStorage,
    purgeLocalStorage,
  };
};

export default useStorage;
