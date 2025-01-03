import { useDirectionManager } from "@/hooks/useDirectionManager";
import { Tabs } from "expo-router";

import TabBarIcon from "@/components/TabBarIcon";

export default function StatsLayout() {
  const { isRTL } = useDirectionManager();

  return (
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
          title: isRTL ? "الملخص" : "Overview",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="pie-chart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cost-analysis"
        options={{
          title: isRTL ? "التكاليف" : "Costs",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="dollar-sign" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
