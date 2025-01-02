// app/stats/_layout.tsx
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { Tabs } from "expo-router";

import { Feather } from "@expo/vector-icons";

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
      <Tabs.Screen
        name="task-frequency"
        options={{
          title: isRTL ? "المهام" : "Tasks",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="monthly-trend"
        options={{
          title: isRTL ? "الشهري" : "Monthly",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="trending-up" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}
