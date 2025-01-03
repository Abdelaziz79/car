import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@card_view_preference";

interface UseCardViewReturn {
  isCompactView: boolean;
  setIsCompactView: (value: boolean) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export const useCardView = (): UseCardViewReturn => {
  const [isCompactView, setIsCompactViewState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the saved preference when the hook mounts
  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const savedPreference = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPreference !== null) {
        setIsCompactViewState(JSON.parse(savedPreference));
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load preference"));
    } finally {
      setIsLoading(false);
    }
  };

  const setIsCompactView = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      setIsCompactViewState(value);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to save preference"));
    }
  };

  return {
    isCompactView,
    setIsCompactView,
    isLoading,
    error,
  };
};
