import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";

const Header: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <LinearGradient
    colors={["#7c3aed", "#6d28d9"]} // violet-600 to violet-700
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    className="px-6 py-8"
  >
    <Text className="text-white text-3xl font-bold">{title}</Text>
    <Text className="text-violet-200 mt-2 text-base">{subtitle}</Text>
  </LinearGradient>
);

export default Header;
