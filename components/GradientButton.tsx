import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

const GradientButton: React.FC<{
  onPress: () => void;
  title: string;
  icon?: string;
}> = ({ onPress, title, icon }) => (
  <TouchableOpacity
    onPress={onPress}
    className="overflow-hidden rounded-xl shadow-lg shadow-violet-300"
  >
    <LinearGradient
      colors={["#7c3aed", "#6d28d9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="py-4 px-6"
    >
      <View className="flex-row items-center justify-center">
        {icon && (
          <Ionicons
            name={icon as any}
            size={24}
            color="white"
            className="mr-2"
          />
        )}
        <Text className="text-white text-center font-bold text-lg">
          {title}
        </Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default GradientButton;
