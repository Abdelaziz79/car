import React from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const DistanceBasedMaintenance = ({
  kilometers,
  setKilometers,
}: {
  kilometers: any;
  setKilometers: any;
}) => {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-slate-800 mb-2">
        المسافة (كم)
      </Text>
      <TextInput
        value={kilometers}
        onChangeText={setKilometers}
        keyboardType="numeric"
        className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
        placeholder="أدخل المسافة بالكيلومترات"
      />
    </View>
  );
};

export default DistanceBasedMaintenance;
