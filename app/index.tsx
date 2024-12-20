import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
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
        {/* Maintenance Categories */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4 text-gray-800">
            الصيانة الدورية
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <GradientButton
              onPress={() => navigate.push("/maintenance/engine")}
              title="المحرك"
              icon="car-outline"
              size="small"
            />
            <GradientButton
              onPress={() => navigate.push("/maintenance/transmission")}
              title="ناقل الحركة"
              icon="cog-outline"
              size="small"
            />
            <GradientButton
              onPress={() => navigate.push("/maintenance/brakes")}
              title="الفرامل"
              icon="disc-outline"
              size="small"
            />
          </View>
        </View>
        {/* Quick Tasks Actions */}
        <View className="mb-6 ">
          <Text className="text-lg font-bold mb-4 text-gray-800">المهام</Text>
          <View className="flex-col gap-4">
            <GradientButton
              onPress={() => navigate.push("/taskScreen/time-based")}
              title="حسب الوقت"
              icon="time-outline"
            />
            <GradientButton
              onPress={() => navigate.push("/taskScreen/distance-based")}
              title="حسب المسافة"
              icon="navigate-outline"
            />
            <GradientButton
              onPress={() => navigate.push("/taskScreen/user-based")}
              title="الخاصة بي"
              icon="person-outline"
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
              onPress={() => navigate.push("/quick-check")}
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
              onPress={() => navigate.push("/reminders")}
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
