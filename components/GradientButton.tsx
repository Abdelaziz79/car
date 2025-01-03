import { useDirectionManager } from "@/hooks/useDirectionManager";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: Record<string, unknown>;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  size = "medium",
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  const { isRTL, directionLoaded } = useDirectionManager();

  const gradientColors = {
    primary: ["#6366f1", "#4f46e5", "#4338ca"],
    secondary: ["#3b82f6", "#2563eb", "#1d4ed8"],
    tertiary: ["#8b5cf6", "#7c3aed", "#6d28d9"],
    danger: ["#ef4444", "#dc2626", "#b91c1c"],
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 14,
      iconSize: 16,
    },
    medium: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      fontSize: 16,
      iconSize: 20,
    },
    large: {
      paddingHorizontal: 32,
      paddingVertical: 16,
      fontSize: 18,
      iconSize: 24,
    },
  };

  if (!directionLoaded) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, { opacity: disabled ? 0.5 : 1 }, style]}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradientColors[variant] as [string, string, string]}
        start={isRTL ? { x: 1, y: 0 } : { x: 0, y: 0 }}
        end={isRTL ? { x: 0, y: 1 } : { x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            paddingVertical: sizeStyles[size].paddingVertical,
            opacity: loading ? 0.7 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <View
            style={{
              ...styles.contentContainer,
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            {icon && (
              <Ionicons
                name={icon}
                size={sizeStyles[size].iconSize}
                color="white"
                style={{
                  marginRight: isRTL ? 0 : 8,
                  marginLeft: isRTL ? 8 : 0,
                }}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeStyles[size].fontSize,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    minWidth: 64,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
});

export default GradientButton;
