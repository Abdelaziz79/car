import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import Loading from "@/components/Loading";
import TabBarIcon from "@/components/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { directionLoaded, isRTL } = useDirectionManager();

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
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: "white" },
            tabBarActiveTintColor: "#4F46E5",
            tabBarInactiveTintColor: "#64748B",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: isRTL ? "المهام" : "Tasks",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="list" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="add"
            options={{
              title: isRTL ? "إضافة" : "Add",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="plus-circle" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="record"
            options={{
              title: isRTL ? "السجلات" : "Records",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="file-text" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(stats)"
            options={{
              title: isRTL ? "الإحصائيات" : "Stats",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="bar-chart-2" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: isRTL ? "الإعدادات" : "Settings",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="settings" color={color} />
              ),
            }}
          />
        </Tabs>
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
