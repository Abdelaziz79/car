import { StorageManager } from "@/utils/storageHelpers";
import React from "react";
import { Alert, Modal, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import GradientButton from "./GradientButton";

const RenderKmModal = ({
  currentKm,
  setCurrentKm,
  modals,
  toggleModal,
}: {
  currentKm: number;
  setCurrentKm: React.Dispatch<React.SetStateAction<number>>;
  modals: { km: boolean };
  toggleModal: (modalName: keyof typeof modals, value: boolean) => void;
}) => {
  const [newKm, setNewKm] = React.useState("");
  const handleKmUpdate = async () => {
    const kmNumber = parseInt(newKm);

    if (isNaN(kmNumber)) {
      Alert.alert("خطأ", "الرجاء إدخال رقم صحيح");
      return;
    }

    if (kmNumber < currentKm) {
      Alert.alert("خطأ", "لا يمكن إدخال قيمة أقل من العداد الحالي");
      return;
    }

    try {
      await StorageManager.setCurrentKm(kmNumber);
      setCurrentKm(kmNumber);
      setNewKm("");
      toggleModal("km", false);
      Alert.alert("نجاح", "تم تحديث عداد المسافات بنجاح");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث عداد المسافات");
    }
  };

  return (
    <Modal
      visible={modals.km}
      animationType="slide"
      transparent={true}
      onRequestClose={() => toggleModal("km", false)}
    >
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="bg-white rounded-xl p-6 w-3/4">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            تحديث عداد المسافات
          </Text>
          <TextInput
            className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-right mb-4"
            keyboardType="numeric"
            placeholder="أدخل قراءة العداد الجديدة"
            value={newKm}
            onChangeText={setNewKm}
          />
          <GradientButton
            onPress={handleKmUpdate}
            title="تحديث"
            icon="save-outline"
          />
          <GradientButton
            onPress={() => toggleModal("km", false)}
            title="إلغاء"
            icon="close-outline"
            colors={["#F87171", "#EF4444"]}
            className="mt-4"
          />
        </View>
      </View>
    </Modal>
  );
};

export default RenderKmModal;
