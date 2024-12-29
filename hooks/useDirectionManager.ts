// hooks/useDirectionManager.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { I18nManager } from "react-native";

export const useDirectionManager = () => {
  const [isRTL, setIsRTL] = useState(false); // Initialize as false
  const [directionLoaded, setDirectionLoaded] = useState(false);

  // Load saved direction on mount
  useEffect(() => {
    const initDirection = async () => {
      try {
        const savedDirection = await AsyncStorage.getItem("isRTL");
        const shouldBeRTL = savedDirection === "true";

        // Update I18nManager and state
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        setIsRTL(shouldBeRTL);
        setDirectionLoaded(true);
      } catch (error) {
        console.error("Failed to load direction:", error);
        setDirectionLoaded(true);
      }
    };

    initDirection();
  }, []);

  const toggleDirection = async () => {
    try {
      const newIsRTL = !isRTL;

      // Update AsyncStorage first
      await AsyncStorage.setItem("isRTL", newIsRTL.toString());

      // Then update I18nManager
      I18nManager.allowRTL(newIsRTL);
      I18nManager.forceRTL(newIsRTL);

      // Update state
      setIsRTL(newIsRTL);

      // Reload the app
      setTimeout(async () => {
        try {
          await Updates.reloadAsync();
        } catch (error) {
          console.error("Failed to reload app:", error);
        }
      }, 100); // Small delay to ensure AsyncStorage is updated
    } catch (error) {
      console.error("Failed to toggle direction:", error);
    }
  };

  return { isRTL, directionLoaded, toggleDirection };
};
