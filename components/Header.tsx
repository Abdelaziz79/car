import { useDirectionManager } from "@/hooks/useDirectionManager";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

const Header: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const { isRTL, directionLoaded } = useDirectionManager();

  // Wait until the direction is loaded
  if (!directionLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#7c3aed", "#6d28d9"]} // violet-600 to violet-700
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="px-6 py-8"
    >
      <View className={`w-full ${isRTL ? "items-end" : "items-start"}`}>
        <Text
          className={`text-white text-3xl font-bold ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-violet-200 mt-2 text-base ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {subtitle}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default Header;
