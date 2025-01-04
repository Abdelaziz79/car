import { useDirectionManager } from "@/hooks/useDirectionManager";
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
import TimePicker from "@/components/add-edit/TimePicker";
import Title from "@/components/add-edit/Title";
import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { predefinedTagsAr, predefinedTagsEn } from "@/data/predefined";
import { MaintenanceInterval, MaintenanceType, Tags } from "@/types/allTypes";
import { addUserTask, StorageManager } from "@/utils/storageHelpers";

const AddTaskScreen = () => {
  const { isRTL, directionLoaded } = useDirectionManager();
  const navigate = useRouter();

  // Basic form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MaintenanceType>("time-based");
  const [interval, setInterval] = useState<MaintenanceInterval>("biweekly");
  const [kilometers, setKilometers] = useState("");
  const [tasks, setTasks] = useState<string[]>([""]);

  // Tags state
  const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
  const [customTags, setCustomTags] = useState<Tags[]>([]);

  const predefinedTags = isRTL ? predefinedTagsAr : predefinedTagsEn;

  useEffect(() => {
    loadCustomData();
  }, []);

  const loadCustomData = async () => {
    try {
      const savedTags = await StorageManager.getCustomTags();
      const filteredCustomTags = savedTags.filter(
        (tag) => !predefinedTags.includes?.(tag)
      );
      setCustomTags(filteredCustomTags);
    } catch (error) {
      console.error("Error loading custom tags:", error);
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL
          ? "حدث خطأ أثناء تحميل التصنيفات المخصصة"
          : "Error loading custom tags"
      );
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL ? "يرجى إدخال عنوان المهمة" : "Please enter a task title"
      );
      return;
    }

    const validTasks = tasks.filter((task) => task.trim());
    if (validTasks.length === 0) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL
          ? "يرجى إدخال مهمة واحدة على الأقل"
          : "Please enter at least one task"
      );
      return;
    }

    try {
      await addUserTask({
        title: title.trim(),
        description: description.trim(),
        type,
        tags: selectedTags,
        interval: type === "time-based" ? interval : undefined,
        kilometers: type === "distance-based" ? Number(kilometers) : undefined,
        tasks: validTasks,
        isRecurring: true,
      });

      Alert.alert(
        isRTL ? "نجاح" : "Success",
        isRTL ? "تمت إضافة المهمة بنجاح" : "Task added successfully",
        [
          {
            text: isRTL ? "موافق" : "OK",
            onPress: () => navigate.push("/"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL ? "حدث خطأ أثناء إضافة المهمة" : "Error adding task"
      );
    }
  };

  if (!directionLoaded) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={isRTL ? "إضافة مهمة صيانة" : "Add Maintenance Task"}
        subtitle={
          isRTL
            ? "أدخل تفاصيل مهمة الصيانة الجديدة"
            : "Enter details for the new maintenance task"
        }
        variant="secondary"
      />
      <ScrollView
        className="flex-1 p-6"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <Title
          title={title}
          setTitle={setTitle}
          directionLoaded={directionLoaded}
          isRTL={isRTL}
        />
        <Description
          description={description}
          setDescription={setDescription}
          directionLoaded={directionLoaded}
          isRTL={isRTL}
        />

        <View className="mb-6" style={{ direction: isRTL ? "rtl" : "ltr" }}>
          <Text className="text-lg font-bold text-slate-800 mb-2 items-center ">
            {isRTL ? "التصنيفات" : "Categories"}
          </Text>

          <CustomTagInput
            customTags={customTags}
            setCustomTags={setCustomTags}
            setSelectedTags={setSelectedTags}
            directionLoaded={directionLoaded}
            isRTL={isRTL}
          />

          <PredefinedTags
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            directionLoaded={directionLoaded}
            isRTL={isRTL}
          />

          <CustomTags
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            customTags={customTags}
            setCustomTags={setCustomTags}
            directionLoaded={directionLoaded}
            isRTL={isRTL}
          />
        </View>
        <TimePicker isRTL={isRTL} type={type} setType={setType} />

        {type === "time-based" && (
          <TimeBasedMaintenance
            interval={interval}
            setInterval={setInterval}
            isRTL={isRTL}
            directionLoaded={directionLoaded}
          />
        )}

        {type === "distance-based" && (
          <DistanceBasedMaintenance
            kilometers={kilometers}
            setKilometers={setKilometers}
            directionLoaded={directionLoaded}
            isRTL={isRTL}
          />
        )}

        <TasksSection
          tasks={tasks}
          setTasks={setTasks}
          isRTL={isRTL}
          directionLoaded={directionLoaded}
        />

        <View className="mb-10">
          <GradientButton
            onPress={handleSubmit}
            title={isRTL ? "حفظ المهمة" : "Save Task"}
            icon="save-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTaskScreen;
