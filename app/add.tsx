import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import { MaintenanceInterval, MaintenanceType, Tags } from "@/types/allTypes";
import {
  formatCustomDayInterval,
  formatIntervalDisplay,
} from "@/utils/maintenanceHelpers";
import { addUserTask, StorageManager } from "@/utils/storageHelpers";

const AddTaskScreen = () => {
  // Basic form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MaintenanceType>("time-based");
  const [interval, setInterval] = useState<MaintenanceInterval>("biweekly");
  const [kilometers, setKilometers] = useState("");
  const [tasks, setTasks] = useState<string[]>([""]);

  // Tags state
  const [selectedTags, setSelectedTags] = useState<Tags[]>(["غير محدد"]);
  const [newTagText, setNewTagText] = useState("");
  const [customTags, setCustomTags] = useState<Tags[]>([]);

  // Intervals state
  const [customIntervals, setCustomIntervals] = useState<MaintenanceInterval[]>(
    []
  );
  const [customDays, setCustomDays] = useState("");

  const navigate = useRouter();

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
  const predefinedIntervals: MaintenanceInterval[] = [
    "biweekly",
    "monthly",
    "quarterly",
    "semiannual",
    "annual",
    "biennial",
    "triennial",
  ];

  useEffect(() => {
    loadCustomData();
  }, []);

  const loadCustomData = async () => {
    try {
      const savedTags = await StorageManager.getCustomTags();
      // Filter out any predefined tags that might have been saved as custom
      const filteredCustomTags = savedTags.filter(
        (tag) => !predefinedTags.includes(tag)
      );
      setCustomTags(filteredCustomTags);
    } catch (error) {
      console.error("Error loading custom tags:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحميل التصنيفات المخصصة");
    }
  };
  // Task management
  const handleTaskChange = (text: string, index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = text;
    setTasks(newTasks);
  };

  const handleAddTask = () => setTasks([...tasks, ""]);

  const handleRemoveTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  // Tag management
  const handleTagToggle = (tag: Tags) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.length > 1 ? prev.filter((t) => t !== tag) : prev;
      }
      return [...prev, tag];
    });
  };

  const handleAddCustomTag = async () => {
    const trimmedTag = newTagText.trim() as Tags;

    // Validate the new tag
    if (!trimmedTag) {
      return;
    }

    // Check if tag already exists in predefined tags
    if (predefinedTags.includes(trimmedTag)) {
      Alert.alert("تنبيه", "هذا التصنيف موجود مسبقاً في التصنيفات الأساسية");
      setNewTagText("");
      return;
    }

    // Check if tag already exists in custom tags
    if (customTags.includes(trimmedTag)) {
      Alert.alert("تنبيه", "هذا التصنيف موجود مسبقاً في التصنيفات المخصصة");
      setNewTagText("");
      return;
    }

    try {
      await StorageManager.saveCustomTag(trimmedTag);
      setCustomTags((prev) => [...prev, trimmedTag]);
      setSelectedTags((prev) => [...prev, trimmedTag]);
      setNewTagText("");
    } catch (error) {
      console.error("Error saving custom tag:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ التصنيف المخصص");
    }
  };

  const handleRemoveCustomTag = async (tag: Tags) => {
    try {
      // Remove from custom tags
      setCustomTags((prev) => prev.filter((t) => t !== tag));
      // Remove from selected tags if it was selected
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
      // You might want to also remove it from storage
      // Assuming StorageManager has a method for this
      // await StorageManager.removeCustomTag(tag);
    } catch (error) {
      console.error("Error removing custom tag:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء حذف التصنيف المخصص");
    }
  };

  // Interval management
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
      setInterval(customInterval); // Set the newly created interval as selected
      setCustomDays("");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ الفترة المخصصة");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("خطأ", "يرجى إدخال عنوان المهمة");
      return;
    }

    const validTasks = tasks.filter((task) => task.trim());
    if (validTasks.length === 0) {
      Alert.alert("خطأ", "يرجى إدخال مهمة واحدة على الأقل");
      return;
    }

    try {
      await addUserTask({
        title: title.trim(),
        description: description.trim(),
        type,
        tags: selectedTags,
        interval: type === "time-based" ? interval : undefined,
        kilometers:
          type === "distance-based" ? parseInt(kilometers) : undefined,
        tasks: validTasks,
        isRecurring: true,
      });

      Alert.alert("نجاح", "تمت إضافة المهمة بنجاح", [
        { text: "موافق", onPress: () => navigate.push("/") },
      ]);
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء إضافة المهمة");
    }
  };

  const renderIntervalPicker = () => {
    const allIntervals = [...predefinedIntervals, ...customIntervals];
    const uniqueIntervals = Array.from(new Set(allIntervals)); // Remove duplicates

    return (
      <Picker
        selectedValue={interval}
        onValueChange={(itemValue) => setInterval(itemValue)}
      >
        {uniqueIntervals.map((int) => (
          <Picker.Item
            key={int}
            label={formatIntervalDisplay(int)}
            value={int}
          />
        ))}
      </Picker>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title="إضافة مهمة صيانة"
        subtitle="أدخل تفاصيل مهمة الصيانة الجديدة"
      />
      <ScrollView className="flex-1 p-6">
        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-2">
            عنوان المهمة
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
            placeholder="أدخل عنوان المهمة"
          />
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-2">الوصف</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
            multiline
            numberOfLines={4}
            placeholder="أدخل وصف المهمة"
            textAlignVertical="top"
          />
        </View>

        {/* Tags Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-2">
            التصنيفات
          </Text>

          {/* Custom Tag Input */}
          <View className="flex-row items-center gap-2 mb-3">
            <TextInput
              value={newTagText}
              onChangeText={setNewTagText}
              onSubmitEditing={handleAddCustomTag}
              className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
              placeholder="أضف تصنيف مخصص"
            />
            <TouchableOpacity
              onPress={handleAddCustomTag}
              className="bg-violet-100 p-3 rounded-xl"
            >
              <Ionicons name="add" size={24} color="#7c3aed" />
            </TouchableOpacity>
          </View>

          {/* Predefined Tags */}
          <View className="flex-row flex-wrap gap-2 mb-2">
            {predefinedTags.map((tag) => (
              <TouchableOpacity
                key={`predefined-${tag}`}
                onPress={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-full ${
                  selectedTags.includes(tag) ? "bg-violet-600" : "bg-slate-200"
                }`}
              >
                <Text
                  className={`${
                    selectedTags.includes(tag) ? "text-white" : "text-slate-700"
                  } font-medium`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Tags */}
          <View className="flex-row flex-wrap gap-2">
            {customTags.map((tag) => (
              <View key={`custom-${tag}`} className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-l-full ${
                    selectedTags.includes(tag)
                      ? "bg-violet-600"
                      : "bg-slate-200"
                  }`}
                >
                  <Text
                    className={`${
                      selectedTags.includes(tag)
                        ? "text-white"
                        : "text-slate-700"
                    } font-medium`}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveCustomTag(tag)}
                  className="bg-rose-100 p-2 rounded-r-full"
                >
                  <Ionicons name="close" size={20} color="#e11d48" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Maintenance Type */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-2">
            نوع الصيانة
          </Text>
          <View className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
            >
              <Picker.Item label="حسب الوقت" value="time-based" />
              <Picker.Item label="حسب المسافة" value="distance-based" />
            </Picker>
          </View>
        </View>

        {/* Time-based maintenance section */}
        {type === "time-based" && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-800 mb-2">
              الفترة
            </Text>
            <View className="flex-row items-center gap-2 mb-3">
              <TextInput
                value={customDays}
                onChangeText={setCustomDays}
                keyboardType="numeric"
                className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
                placeholder="أدخل عدد الأيام"
              />
              <TouchableOpacity
                onPress={handleAddCustomDayInterval}
                className="bg-violet-100 p-3 rounded-xl"
              >
                <Ionicons name="add" size={24} color="#7c3aed" />
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {renderIntervalPicker()}
            </View>
          </View>
        )}

        {/* Distance-based maintenance section */}
        {type === "distance-based" && (
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
        )}

        {/* Tasks Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-2">المهام</Text>
          <View className="space-y-3">
            {tasks.map((task, index) => (
              <View
                key={`task-${index}`}
                className="flex-row items-center gap-2 mt-2"
              >
                <TextInput
                  value={task}
                  onChangeText={(text) => handleTaskChange(text, index)}
                  className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
                  placeholder="أدخل المهمة"
                />
                <TouchableOpacity
                  onPress={() => handleRemoveTask(index)}
                  className="bg-rose-100 p-3 rounded-xl"
                >
                  <Ionicons name="trash-outline" size={24} color="#e11d48" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleAddTask}
            className="mt-3 flex-row items-center justify-center bg-violet-100 p-3 rounded-xl"
          >
            <Ionicons name="add" size={24} color="#7c3aed" className="mr-2" />
            <Text className="text-violet-700 font-medium mr-2">إضافة مهمة</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View className="mb-10">
          <GradientButton
            onPress={handleSubmit}
            title="حفظ المهمة"
            icon="save-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTaskScreen;
