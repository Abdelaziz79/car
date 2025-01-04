import DashboardStats from "@/components/DashboardStats";
import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigate = useRouter();
  const { isRTL, directionLoaded } = useDirectionManager();

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

  if (!directionLoaded) return <Loading />;

  const renderSection = (title: string, children: React.ReactNode) => (
    <View
      className="mb-6 bg-white rounded-2xl p-2 shadow-sm"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <Text className={`text-lg font-bold mb-4 text-gray-800 `}>{title}</Text>
      <View className="flex-col gap-3">{children}</View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <Header title={content.header.title} subtitle={content.header.subtitle} />

      <DashboardStats />

      <ScrollView className="flex-1 px-4" scrollEventThrottle={16}>
        {renderSection(
          content.sections.tasks.title,
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/all-tasks")}
              title={content.sections.tasks.viewAll}
              icon="list-outline"
              variant="primary"
            />
            <GradientButton
              onPress={() => navigate.push("/add")}
              title={isRTL ? "إضافة مهمة" : "Add Task"}
              icon="add-outline"
              variant="secondary"
            />
          </View>
        )}

        {renderSection(
          content.sections.quickActions.title,
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/(stats)")}
              title={content.sections.quickActions.stats}
              icon="stats-chart-outline"
              variant="secondary"
            />
            <GradientButton
              onPress={() => navigate.push("/record")}
              title={content.sections.quickActions.maintenanceRecord}
              icon="document-text-outline"
              variant="secondary"
            />
          </View>
        )}

        {renderSection(
          content.sections.toolsSettings.title,
          <GradientButton
            onPress={() => navigate.push("/settings")}
            title={content.sections.toolsSettings.settings}
            icon="settings-outline"
            variant="tertiary"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
