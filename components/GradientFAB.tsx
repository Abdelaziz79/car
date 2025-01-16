import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

const GradientFAB: React.FC<{
  onPress: () => void;
  isRTL: boolean;
  directionLoaded: boolean;
}> = ({ onPress, isRTL, directionLoaded }) => {
  if (!directionLoaded) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      className={` w-16 h-16 rounded-full overflow-hidden shadow-lg shadow-violet-300`}
      style={{
        position: "absolute",
        bottom: 24,
        left: isRTL ? 24 : undefined,
        right: isRTL ? undefined : 24,
      }}
    >
      <LinearGradient
        colors={["#7c3aed", "#6d28d9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="w-full h-full items-center justify-center"
      >
        <Ionicons name="add" size={32} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientFAB;
