import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import Loading from "@/components/Loading";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { directionLoaded } = useDirectionManager();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded && directionLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Error hiding splash screen:", error);
      }
    }
    prepare();
  }, [loaded, directionLoaded]);

  if (!loaded || !directionLoaded) {
    return <Loading />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="add"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="record"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="all-tasks"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(stats)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
