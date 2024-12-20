import React from "react";
import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "small" | "medium" | "large";
  colors?: string[];
  disabled?: boolean;
  loading?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  size = "medium",
  colors = ["#6366f1", "#4f46e5"],
  disabled = false,
  loading = false,
}) => {
  const sizeStyles = {
    small: {
      container: "px-4 py-2",
      text: "text-sm",
      icon: 16,
    },
    medium: {
      container: "px-6 py-3",
      text: "text-base",
      icon: 20,
    },
    large: {
      container: "px-8 py-4",
      text: "text-lg",
      icon: 24,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className="rounded-xl overflow-hidden"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`flex-row items-center justify-center ${sizeStyles[size].container}`}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            {icon && (
              <Ionicons
                name={icon}
                size={sizeStyles[size].icon}
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <Text className={`font-bold text-white ${sizeStyles[size].text}`}>
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
