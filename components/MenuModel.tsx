import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

const MenuModel = ({
  menuVisible,
  setMenuVisible,
  item,
  setCompletionModalVisible,
  onDelete,
}: {
  menuVisible: boolean;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  item: any;
  setCompletionModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (id: string) => void;
}) => {
  const handleDelete = () => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذه المهمة؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        onPress: () => {
          onDelete(item.id);
          setMenuVisible(false);
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <Modal
      visible={menuVisible}
      transparent
      onRequestClose={() => setMenuVisible(false)}
      animationType="fade"
    >
      <TouchableOpacity
        className="flex-1  bg-black/30"
        onPress={() => setMenuVisible(false)}
      >
        <View className="bg-white rounded-xl w-11/12 max-w-md mx-auto mt-72 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-center text-gray-800">
              {item.title}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setMenuVisible(false);
              setCompletionModalVisible(true);
            }}
            className="p-4 flex-row items-center justify-center border-b border-gray-100"
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={24}
              color="#3B82F6"
            />
            <Text className="text-blue-600 text-lg font-medium mx-2">
              إكمال المهمة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="p-4 flex-row items-center justify-center"
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={24}
              color="#EF4444"
            />
            <Text className="text-red-600 text-lg font-medium mx-2">
              حذف المهمة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMenuVisible(false)}
            className="p-4 border-t border-gray-100"
          >
            <Text className="text-gray-600 text-center font-medium">إلغاء</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MenuModel;
