import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
};

export default Loading;
