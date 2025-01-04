import { useDirectionManager } from "@/hooks/useDirectionManager";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  size = "medium",
  variant = "primary",
  disabled = false,
  loading = false,
  className,
}) => {
  const { isRTL, directionLoaded } = useDirectionManager();

  const gradientColors = {
    primary: ["#6366f1", "#4f46e5", "#4338ca"],
    secondary: ["#3b82f6", "#2563eb", "#1d4ed8"],
    tertiary: ["#8b5cf6", "#7c3aed", "#6d28d9"],
    danger: ["#ef4444", "#dc2626", "#b91c1c"],
  };

  const sizeClasses = {
    small: {
      button: "px-4 py-2",
      text: "text-sm",
      icon: 16,
    },
    medium: {
      button: "px-6 py-3",
      text: "text-base",
      icon: 20,
    },
    large: {
      button: "px-8 py-4",
      text: "text-lg",
      icon: 24,
    },
  };

  if (!directionLoaded) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-xl overflow-hidden min-w-[64px] ${
        disabled ? "opacity-50" : "opacity-100"
      } ${className}`}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradientColors[variant] as [string, string]}
        start={isRTL ? { x: 1, y: 0 } : { x: 0, y: 0 }}
        end={isRTL ? { x: 0, y: 1 } : { x: 1, y: 1 }}
        style={{
          opacity: loading ? 0.7 : 1,
          padding: 0,
        }}
      >
        <View
          className={`${sizeClasses[size].button}`}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <View className={`flex-row items-center justify-center `}>
              {icon && (
                <Ionicons
                  name={icon}
                  size={sizeClasses[size].icon}
                  color="white"
                  style={{ marginHorizontal: 4 }}
                />
              )}
              <Text
                className={`font-bold text-white ${sizeClasses[size].text} `}
              >
                {title}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
