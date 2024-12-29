import { StorageManager } from "@/utils/storageHelpers";
import React from "react";
import { Alert, Modal, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import GradientButton from "./GradientButton";

interface RenderKmModalProps {
  currentKm: number;
  setCurrentKm: React.Dispatch<React.SetStateAction<number>>;
  modals: { km: boolean };
  toggleModal: (modalName: keyof { km: boolean }, value: boolean) => void;
  isRTL: boolean;
  directionLoaded: boolean;
}

const RenderKmModal: React.FC<RenderKmModalProps> = ({
  currentKm,
  setCurrentKm,
  modals,
  toggleModal,
  isRTL,
  directionLoaded,
}) => {
  const [newKm, setNewKm] = React.useState("");

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      updateOdometer: isRTL ? "تحديث عداد المسافات" : "Update Odometer",
      enterNewOdometer: isRTL
        ? "أدخل قراءة العداد الجديدة"
        : "Enter new odometer reading",
      correctNumber: isRTL
        ? "الرجاء إدخال رقم صحيح"
        : "Please enter a valid number",
      greaterThanCurrent: isRTL
        ? "لا يمكن إدخال قيمة أقل من العداد الحالي"
        : "Cannot enter a value less than the current odometer",
      successUpdate: isRTL
        ? "تم تحديث عداد المسافات بنجاح"
        : "Odometer updated successfully",
      errorUpdate: isRTL
        ? "حدث خطأ أثناء تحديث عداد المسافات"
        : "An error occurred while updating the odometer",
      update: isRTL ? "تحديث" : "Update",
      cancel: isRTL ? "إلغاء" : "Cancel",
    };
    return textMap[key] || key;
  };

  const handleKmUpdate = async () => {
    const kmNumber = parseInt(newKm);

    if (isNaN(kmNumber)) {
      Alert.alert(getText("error"), getText("correctNumber"));
      return;
    }

    if (kmNumber < currentKm) {
      Alert.alert(getText("error"), getText("greaterThanCurrent"));
      return;
    }

    try {
      await StorageManager.setCurrentKm(kmNumber);
      setCurrentKm(kmNumber);
      setNewKm("");
      toggleModal("km", false);
      Alert.alert(getText("success"), getText("successUpdate"));
    } catch (error) {
      Alert.alert(getText("error"), getText("errorUpdate"));
    }
  };

  if (!directionLoaded) {
    return null;
  }
  return (
    <Modal
      visible={modals.km}
      animationType="slide"
      transparent={true}
      onRequestClose={() => toggleModal("km", false)}
    >
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="bg-white rounded-xl p-6 w-3/4">
          <Text
            className="text-xl font-bold text-slate-800 mb-4"
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {getText("updateOdometer")}
          </Text>
          <TextInput
            className="bg-gray-50 p-2 rounded-lg border border-gray-200  mb-4"
            keyboardType="numeric"
            placeholder={getText("enterNewOdometer")}
            value={newKm}
            onChangeText={setNewKm}
            style={{ textAlign: isRTL ? "right" : "left" }}
          />
          <GradientButton
            onPress={handleKmUpdate}
            title={getText("update")}
            icon="save-outline"
          />
          <GradientButton
            onPress={() => toggleModal("km", false)}
            title={getText("cancel")}
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
