import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

interface MenuModelProps {
  menuVisible: boolean;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  item: any;
  setCompletionModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (id: string) => void;
  setUpdateModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isRTL: boolean;
  directionLoaded: boolean;
}

const MenuModel: React.FC<MenuModelProps> = ({
  menuVisible,
  setMenuVisible,
  item,
  setCompletionModalVisible,
  onDelete,
  setUpdateModalVisible,
  isRTL,
  directionLoaded,
}) => {
  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      confirmDelete: isRTL ? "تأكيد الحذف" : "Confirm Delete",
      deleteMessage: isRTL
        ? "هل أنت متأكد من حذف هذه المهمة؟"
        : "Are you sure you want to delete this task?",
      cancel: isRTL ? "إلغاء" : "Cancel",
      delete: isRTL ? "حذف" : "Delete",
      completeTask: isRTL ? "إكمال المهمة" : "Complete Task",
      editTask: isRTL ? "تعديل المهمة" : "Edit Task",
      deleteTask: isRTL ? "حذف المهمة" : "Delete Task",
    };
    return textMap[key] || key;
  };

  const handleDelete = () => {
    Alert.alert(getText("confirmDelete"), getText("deleteMessage"), [
      { text: getText("cancel"), style: "cancel" },
      {
        text: getText("delete"),
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
            <Text
              className="text-lg font-bold text-center text-gray-800"
              style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
            >
              {item.title}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setMenuVisible(false);
              setCompletionModalVisible(true);
            }}
            className={`p-4 items-center justify-center border-b border-gray-100 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={24}
              color="#3B82F6"
            />
            <Text
              className="text-blue-600 text-lg font-medium mx-2"
              style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
            >
              {getText("completeTask")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMenuVisible(false);
              setUpdateModalVisible(true);
            }}
            className={`p-4 items-center justify-center border-b border-gray-100 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color="#10B981"
            />
            <Text
              className="text-emerald-600 text-lg font-medium mx-2"
              style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
            >
              {getText("editTask")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className={`p-4 items-center justify-center border-b border-gray-100 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={24}
              color="#EF4444"
            />
            <Text
              className="text-red-600 text-lg font-medium mx-2"
              style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
            >
              {getText("deleteTask")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMenuVisible(false)}
            className="p-4 border-t border-gray-100"
          >
            <Text
              className="text-gray-600 text-center font-medium"
              style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
            >
              {getText("cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MenuModel;
