import { useDirectionManager } from "@/hooks/useDirectionManager";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "small" | "medium" | "large";
  colors?: [string, string, ...string[]];
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  size = "medium",
  colors = ["#6366f1", "#4f46e5"],
  disabled = false,
  loading = false,
  className = "",
}) => {
  const { isRTL, directionLoaded } = useDirectionManager();

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

  if (!directionLoaded) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        opacity: disabled ? 0.5 : 1,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <LinearGradient
        colors={colors}
        start={isRTL ? { x: 1, y: 0 } : { x: 0, y: 0 }}
        end={isRTL ? { x: 0, y: 1 } : { x: 1, y: 1 }}
        className={`flex-row items-center justify-center ${
          sizeStyles[size].container
        } ${loading ? "opacity-50" : ""}`}
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
                style={{
                  marginRight: isRTL ? 0 : 8,
                  marginLeft: isRTL ? 8 : 0,
                }}
              />
            )}
            <Text
              className={`font-bold text-white ${sizeStyles[size].text}`}
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
