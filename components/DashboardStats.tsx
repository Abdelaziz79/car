import { useDirectionManager } from "@/hooks/useDirectionManager";
import { MaintenanceStats } from "@/utils/statsHelpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface StatItemProps {
  value: number | string;
  label: {
    ar: string;
    en: string;
  };
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  gradientColors: string[];
  onPress: () => void;
  animationDelay?: number;
  isLoading?: boolean;
}

const StatItem = ({
  value,
  label,
  icon,
  gradientColors,
  onPress,
  isLoading = false,
}: StatItemProps) => {
  const { isRTL } = useDirectionManager();

  return (
    <View>
      <TouchableOpacity onPress={onPress} className="active:scale-95 ">
        <LinearGradient
          colors={gradientColors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 12,
            width: 112,
          }}
        >
          <View className="items-center space-y-2">
            <MaterialCommunityIcons
              name={icon}
              size={24}
              color="white"
              style={{ opacity: 0.9 }}
            />
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-2xl font-bold text-white">
                {typeof value === "number"
                  ? isRTL
                    ? value.toLocaleString()
                    : value.toString()
                  : value}
              </Text>
            )}
            <Text className="text-sm text-white/90 text-center">
              {isRTL ? label.ar : label.en}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const DashboardStats = () => {
  const [data, setData] = useState<{
    totalCosts: number;
    totalMaintenances: number;
    totalKilometers: number;
  }>();
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useRouter();
  const { isRTL, directionLoaded } = useDirectionManager();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          setIsLoading(true);
          const stats = await MaintenanceStats.getStats();
          setData(stats);
        } catch (error) {
          console.error("Failed to load stats:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, [])
  );

  if (!directionLoaded) {
    return null;
  }

  const stats = [
    {
      value: data?.totalMaintenances || 0,
      label: { ar: "الصيانات", en: "Maintenances" },
      icon: "wrench" as const,
      gradientColors: ["#8B5CF6", "#6D28D9"],
    },
    {
      value: data?.totalCosts || 0,
      label: { ar: "المصاريف", en: "Costs" },
      icon: "currency-usd" as const,
      gradientColors: ["#0EA5E9", "#0369A1"],
    },
    {
      value: data?.totalKilometers || 0,
      label: { ar: "الكيلومترات", en: "Kilometers" },
      icon: "speedometer" as const,
      gradientColors: ["#14B8A6", "#0D9488"],
    },
  ];

  return (
    <View
      className="flex-row justify-between p-4"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          gradientColors={stat.gradientColors}
          onPress={() => navigation.push("/record")}
          isLoading={isLoading}
        />
      ))}
    </View>
  );
};

export default DashboardStats;
