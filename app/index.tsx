import DashboardStats from "@/components/DashboardStats";
import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigate = useRouter();
  const { isRTL, directionLoaded } = useDirectionManager();

  // Content translations
  const content = {
    header: {
      title: isRTL ? "نظام صيانة السيارة" : "Car Maintenance System",
      subtitle: isRTL
        ? "تتبع صيانة سيارتك بسهولة وفعالية"
        : "Track your car maintenance easily and efficiently",
    },
    sections: {
      tasks: {
        title: isRTL ? "المهام" : "Tasks",
        viewAll: isRTL ? "عرض جميع المهام" : "View All Tasks",
      },
      quickActions: {
        title: isRTL ? "إجراءات سريعة" : "Quick Actions",
        stats: isRTL ? "تقارير" : "Reports",
        maintenanceRecord: isRTL ? "سجل الصيانة" : "Maintenance Record",
      },
      toolsSettings: {
        title: isRTL ? "الأدوات والإعدادات" : "Tools & Settings",
        reminders: isRTL ? "التذكيرات" : "Reminders",
        settings: isRTL ? "الإعدادات" : "Settings",
      },
    },
  };
  if (!directionLoaded) {
    return null;
  }
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header title={content.header.title} subtitle={content.header.subtitle} />

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Main Navigation */}
      <ScrollView className="flex-1 px-6">
        {/* Quick Tasks Actions */}
        <View className="mb-6">
          <Text
            className={`text-lg font-bold mb-4 text-gray-800 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {content.sections.tasks.title}
          </Text>
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/all-tasks")}
              title={content.sections.tasks.viewAll}
              icon="list-outline"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text
            className={`text-lg font-bold mb-4 text-gray-800 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {content.sections.quickActions.title}
          </Text>
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/stats")}
              title={content.sections.quickActions.stats}
              icon="stats-chart-outline"
            />
            <GradientButton
              onPress={() => navigate.push("/record")}
              title={content.sections.quickActions.maintenanceRecord}
              icon="document-text-outline"
            />
          </View>
        </View>

        {/* Tools & Settings */}
        <View>
          <Text
            className={`text-lg font-bold mb-4 text-gray-800 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {content.sections.toolsSettings.title}
          </Text>
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/")}
              title={content.sections.toolsSettings.reminders}
              icon="notifications-outline"
            />
            <GradientButton
              onPress={() => navigate.push("/settings")}
              title={content.sections.toolsSettings.settings}
              icon="settings-outline"
            />
          </View>
        </View>
      </ScrollView>

      <GradientFAB
        onPress={() => navigate.push("/add")}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
      />
    </SafeAreaView>
  );
}

// TODO: handle delete record (history)
// TODO: add import or export data
// TODO: add about the app
// TODO: enhance tasks state (today upcoming complete)
// TODO: add some statistics
// TODO: enhance styling
// TODO: create logo
// TODO: fix app.js settings
// TODO: add a website for the app
