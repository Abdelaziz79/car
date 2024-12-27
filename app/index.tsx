import DashboardStats from "@/components/DashboardStats";
import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigate = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title="نظام صيانة السيارة"
        subtitle="تتبع صيانة سيارتك بسهولة وفعالية"
      />

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Main Navigation */}
      <ScrollView className="flex-1 px-6">
        {/* Quick Tasks Actions */}
        <View className="mb-6 ">
          <Text className="text-lg font-bold mb-4 text-gray-800">المهام</Text>
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/all-tasks")}
              title="عرض جميع المهام"
              icon="list-outline"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6 ">
          <Text className="text-lg font-bold mb-4 text-gray-800">
            إجراءات سريعة
          </Text>
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/")}
              title="فحص سريع"
              icon="checkmark-circle-outline"
            />
            <GradientButton
              onPress={() => navigate.push("/record")}
              title="سجل الصيانة"
              icon="document-text-outline"
            />
          </View>
        </View>

        {/* Tools & Settings */}
        <View>
          <Text className="text-lg font-bold mb-4 text-gray-800">
            الأدوات والإعدادات
          </Text>
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/")}
              title="التذكيرات"
              icon="notifications-outline"
            />
            <GradientButton
              onPress={() => navigate.push("/settings")}
              title="الإعدادات"
              icon="settings-outline"
            />
          </View>
        </View>
      </ScrollView>

      <GradientFAB onPress={() => navigate.push("/add")} />
    </SafeAreaView>
  );
}

// TODO: handle delete record (history)
