import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  intervalLabels,
  MaintenanceInterval,
  MaintenanceItem,
  MaintenanceType,
  Tags,
} from "@/types/allTypes";
import {
  formatCustomDayInterval,
  formatIntervalDisplay,
} from "@/utils/maintenanceHelpers";
import { StorageManager } from "@/utils/storageHelpers";

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
}

const defaultTheme = {
  primary: "bg-violet-600",
  secondary: "bg-violet-50",
  accent: "bg-violet-100",
  text: "text-violet-900",
  border: "border-violet-200",
  shadow: "shadow-violet-100",
};

const predefinedTags: Tags[] = [
  "المكيف",
  "الطلاء",
  "تنظيف",
  "الإطارات",
  "الزجاج",
  "الضمان",
  "الزيوت",
  "المحرك",
  "غير محدد",
];

const EditModal: React.FC<EditModalProps> = ({
  item,
  onUpdate,
  visible,
  onClose,
  theme = defaultTheme,
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

  const [newTask, setNewTask] = useState("");
  const [customDays, setCustomDays] = useState("");
  const [customIntervals, setCustomIntervals] = useState<MaintenanceInterval[]>(
    []
  );

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

  useEffect(() => {
    const loadCustomIntervals = async () => {
      try {
        const savedIntervals = await StorageManager.getCustomIntervals();
        setCustomIntervals(savedIntervals);
      } catch (error) {
        console.error("Error loading custom intervals:", error);
      }
    };

    loadCustomIntervals();
  }, []);

  const handleAddCustomDayInterval = async () => {
    const days = parseInt(customDays);
    if (isNaN(days) || days <= 0) {
      Alert.alert("خطأ", "يرجى إدخال عدد أيام صحيح");
      return;
    }

    const customInterval = formatCustomDayInterval(days);
    if (!customInterval) return;

    try {
      await StorageManager.saveCustomInterval(customInterval);
      setCustomIntervals((prev) => [...prev, customInterval]);
      setFormState((prev) => ({ ...prev, interval: customInterval }));
      setCustomDays("");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ الفترة المخصصة");
    }
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setFormState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask.trim()],
      }));
      setNewTask("");
    }
  };

  const handleRemoveTask = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleToggleTag = (tag: Tags) => {
    setFormState((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

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
      onClose();
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
            <TextInput
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-right"
              placeholder="عنوان المهمة"
              value={formState.title}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, title: text }))
              }
            />

            {/* Description Input */}
            <TextInput
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-right"
              placeholder="وصف المهمة"
              multiline
              numberOfLines={3}
              value={formState.description}
              onChangeText={(text) =>
                setFormState((prev) => ({ ...prev, description: text }))
              }
            />

            {/* Type Picker */}
            <View className="bg-slate-50 rounded-xl border border-slate-200 mb-4 overflow-hidden">
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
              <>
                <View className="flex-row mb-4 gap-2">
                  <TextInput
                    className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-right"
                    placeholder="أدخل عدد الأيام"
                    value={customDays}
                    onChangeText={setCustomDays}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={handleAddCustomDayInterval}
                    className={`${theme.primary} px-4 rounded-xl justify-center items-center`}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="bg-slate-50 rounded-xl border border-slate-200 mb-4 overflow-hidden">
                  <Picker
                    selectedValue={formState.interval}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, interval: value }))
                    }
                    style={{ direction: "rtl" }}
                  >
                    <Picker.Item label="اختر الفترة" value="" />
                    {[
                      ...Object.entries(intervalLabels),
                      ...customIntervals.map((interval) => [
                        interval,
                        formatIntervalDisplay(interval),
                      ]),
                    ].map(([value, label]) =>
                      value && label ? (
                        <Picker.Item key={value} label={label} value={value} />
                      ) : null
                    )}
                  </Picker>
                </View>
              </>
            )}

            {/* Distance-based Input */}
            {formState.type === "distance-based" && (
              <TextInput
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-right"
                keyboardType="numeric"
                placeholder="عدد الكيلومترات"
                value={formState.kilometers}
                onChangeText={(text) =>
                  setFormState((prev) => ({ ...prev, kilometers: text }))
                }
              />
            )}

            {/* Tasks Section */}
            <Text className="text-lg font-semibold text-slate-800 mb-2">
              المهام الفرعية
            </Text>
            <View className="flex-row mb-4 gap-2">
              <TextInput
                className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-right"
                placeholder="أضف مهمة فرعية"
                value={newTask}
                onChangeText={setNewTask}
                onSubmitEditing={handleAddTask}
              />
              <TouchableOpacity
                onPress={handleAddTask}
                className={`${theme.primary} px-4 rounded-xl justify-center items-center`}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Tasks List */}
            {formState.tasks.map((task, index) => (
              <View key={index} className="flex-row items-center mb-2 gap-2">
                <TouchableOpacity
                  onPress={() => handleRemoveTask(index)}
                  className="bg-rose-500 p-2 rounded-xl"
                >
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
                <Text className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-right">
                  {task}
                </Text>
              </View>
            ))}

            {/* Tags Section */}
            <Text className="text-lg font-semibold text-slate-800 mb-2 mt-4">
              التصنيفات
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {predefinedTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => handleToggleTag(tag)}
                  className={`px-4 py-2 rounded-full ${
                    formState.tags.includes(tag)
                      ? theme.primary
                      : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={
                      formState.tags.includes(tag)
                        ? "text-white"
                        : "text-slate-700"
                    }
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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

// TODO: Add custom tags
