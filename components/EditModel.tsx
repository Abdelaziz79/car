import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MaintenanceInterval,
  MaintenanceItem,
  MaintenanceType,
  Tags,
} from "@/types/allTypes";
import Description from "./add-edit/Description";
import DistanceBasedMaintenance from "./add-edit/DistanceBasedMaintenance";
import TagsSection from "./add-edit/TagSection";
import TasksSection from "./add-edit/TasksSection";
import TimeBasedMaintenance from "./add-edit/TimeBasedMaintenance";
import Title from "./add-edit/Title";

interface EditModalProps {
  item: MaintenanceItem;
  onUpdate: (id: string, updates: Partial<MaintenanceItem>) => Promise<void>;
  visible: boolean;
  onClose: () => void;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    border: string;
    shadow: string;
  };
  onRefresh: () => void;
  closeDetailsModel?: () => void;
}

const defaultTheme = {
  primary: "bg-violet-600",
  secondary: "bg-violet-50",
  accent: "bg-violet-100",
  text: "text-violet-900",
  border: "border-violet-200",
  shadow: "shadow-violet-100",
};

const EditModal: React.FC<EditModalProps> = ({
  item,
  onUpdate,
  visible,
  onClose,
  theme = defaultTheme,
  onRefresh,
  closeDetailsModel,
}) => {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    type: "time-based" as MaintenanceType,
    interval: "" as MaintenanceInterval,
    kilometers: "",
    tasks: [] as string[],
    tags: [] as Tags[],
  });

  useEffect(() => {
    if (item) {
      setFormState({
        title: item.title,
        description: item.description,
        type: item.type,
        interval: item.interval || "",
        kilometers: item.kilometers?.toString() || "",
        tasks: item.tasks || [],
        tags: item.tags || [],
      });
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!formState.title.trim()) {
      Alert.alert("خطأ", "الرجاء إدخال عنوان المهمة");
      return;
    }

    if (
      formState.type === "distance-based" &&
      (!formState.kilometers || isNaN(Number(formState.kilometers)))
    ) {
      Alert.alert("خطأ", "الرجاء إدخال عدد الكيلومترات بشكل صحيح");
      return;
    }

    if (formState.type === "time-based" && !formState.interval) {
      Alert.alert("خطأ", "الرجاء اختيار الفترة الزمنية");
      return;
    }

    try {
      const updates: Partial<MaintenanceItem> = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        type: formState.type,
        tasks: formState.tasks,
        tags: formState.tags,
        ...(formState.type === "time-based"
          ? { interval: formState.interval, kilometers: undefined }
          : { kilometers: Number(formState.kilometers), interval: undefined }),
      };

      await onUpdate(item.id, updates);
      onRefresh();
      onClose();
      closeDetailsModel && closeDetailsModel();
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث المهمة");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md max-h-[90%]">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">
                تعديل المهمة
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 rounded-full bg-slate-100"
              >
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <Title
              title={formState.title}
              setTitle={(text: string) =>
                setFormState((prev) => ({ ...prev, title: text }))
              }
            />
            {/* Description Input */}

            <Description
              description={formState.description}
              setDescription={(text: string) =>
                setFormState((prev) => ({ ...prev, description: text }))
              }
            />
            {/* Tags Section */}
            <TagsSection
              selectedTags={formState.tags}
              onTagsChange={(tags) =>
                setFormState((prev) => ({ ...prev, tags }))
              }
              theme={{
                primary: theme.primary,
                secondary: theme.accent,
              }}
            />
            {/* Type Picker */}
            <View className="bg-white rounded-xl border border-slate-200 mb-4 overflow-hidden">
              <Picker
                selectedValue={formState.type}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    type: value as MaintenanceType,
                  }))
                }
                style={{ direction: "rtl" }}
              >
                <Picker.Item label="على أساس الوقت" value="time-based" />
                <Picker.Item label="على أساس المسافة" value="distance-based" />
              </Picker>
            </View>

            {/* Time-based Input */}
            {formState.type === "time-based" && (
              <TimeBasedMaintenance
                setInterval={(value: MaintenanceInterval) => {
                  setFormState((prev) => ({ ...prev, interval: value }));
                }}
                interval={formState.interval}
              />
            )}

            {/* Distance-based Input */}
            {formState.type === "distance-based" && (
              <DistanceBasedMaintenance
                kilometers={formState.kilometers}
                setKilometers={(value: string) =>
                  setFormState((prev) => ({ ...prev, kilometers: value }))
                }
              />
            )}

            {/* Tasks Section */}
            <TasksSection
              tasks={formState.tasks}
              setTasks={(newTasks: string[]) =>
                setFormState((prev) => ({ ...prev, tasks: newTasks }))
              }
            />
            {/* Action Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleSubmit}
                className={`flex-1 ${theme.primary} px-4 py-3 rounded-xl`}
              >
                <Text className="text-white font-bold text-center">
                  حفظ التغييرات
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-slate-200 px-4 py-3 rounded-xl"
              >
                <Text className="text-slate-700 font-bold text-center">
                  إلغاء
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;
