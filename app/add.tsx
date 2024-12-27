import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomTagInput } from "@/components/add-edit/CustomTagInput";
import CustomTags from "@/components/add-edit/CustomTags";
import Description from "@/components/add-edit/Description";
import DistanceBasedMaintenance from "@/components/add-edit/DistanceBasedMaintenance";
import PredefinedTags from "@/components/add-edit/PredefinedTags";
import TasksSection from "@/components/add-edit/TasksSection";
import TimeBasedMaintenance from "@/components/add-edit/TimeBasedMaintenance";
import Title from "@/components/add-edit/Title";
import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import { predefinedTags } from "@/data/predefined";
import { MaintenanceInterval, MaintenanceType, Tags } from "@/types/allTypes";
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
  const [customTags, setCustomTags] = useState<Tags[]>([]);

  const navigate = useRouter();

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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title="إضافة مهمة صيانة"
        subtitle="أدخل تفاصيل مهمة الصيانة الجديدة"
      />
      <ScrollView className="flex-1 p-6">
        {/* Title Input */}
        <Title title={title} setTitle={setTitle} />

        {/* Description Input */}
        <Description
          description={description}
          setDescription={setDescription}
        />
        {/* Tags Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-2">
            التصنيفات
          </Text>

          {/* Custom Tag Input */}
          <CustomTagInput
            customTags={customTags}
            setCustomTags={setCustomTags}
            setSelectedTags={setSelectedTags}
          />

          {/* Predefined Tags */}
          <PredefinedTags
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          {/* Custom Tags */}
          <CustomTags
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            customTags={customTags}
            setCustomTags={setCustomTags}
          />
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
          <TimeBasedMaintenance interval={interval} setInterval={setInterval} />
        )}

        {/* Distance-based maintenance section */}
        {type === "distance-based" && (
          <DistanceBasedMaintenance
            kilometers={kilometers}
            setKilometers={setKilometers}
          />
        )}

        {/* Tasks Section */}
        <TasksSection tasks={tasks} setTasks={setTasks} />

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
