import { useDirectionManager } from "@/hooks/useDirectionManager";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Text, useWindowDimensions, View } from "react-native";

interface HeaderProps {
  title: string;
  subtitle: string;
  variant?: "primary" | "secondary";
  onLayout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  variant = "primary",
  onLayout,
}) => {
  const { isRTL, directionLoaded } = useDirectionManager();
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;

  const gradientColors = {
    primary: ["#7c3aed", "#6d28d9", "#5b21b6"],
    secondary: ["#3b82f6", "#2563eb", "#1d4ed8"],
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 15,
        stiffness: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!directionLoaded) {
    return null;
  }

  return (
    <>
      <LinearGradient
        colors={gradientColors[variant] as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-10 rounded-b-3xl shadow-lg"
        onLayout={onLayout}
      >
        <Animated.View
          className={`w-full`}
          style={{
            direction: isRTL ? "rtl" : "ltr",
            opacity: fadeAnim,
            transform: [{ translateY }],
          }}
        >
          <Text
            className={`text-white text-4xl font-bold tracking-tight`}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            className={`text-violet-100 mt-3 text-base font-medium opacity-90`}
            numberOfLines={2}
          >
            {subtitle}
          </Text>

          <View className="h-1 w-20 bg-white/30 rounded-full mt-4" />
        </Animated.View>
      </LinearGradient>
    </>
  );
};

export default Header;
