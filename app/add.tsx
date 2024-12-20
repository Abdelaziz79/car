import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import { MaintenanceInterval, MaintenanceType } from "@/types/allTypes";
import { addUserTask } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddTaskScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MaintenanceType>("time-based");
  const [interval, setInterval] = useState<MaintenanceInterval>("biweekly");
  const [kilometers, setKilometers] = useState("");
  const [tasks, setTasks] = useState<string[]>([""]);

  const navigate = useRouter();

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  const updateTask = (text: string, index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = text;
    setTasks(newTasks);
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert("خطأ", "يرجى إدخال عنوان المهمة");
      return;
    }

    if (tasks.filter((task) => task.trim() !== "").length === 0) {
      Alert.alert("خطأ", "يرجى إدخال مهمة واحدة على الأقل");
      return;
    }

    try {
      const newTask = {
        title,
        description,
        type,
        ...(type === "time-based"
          ? { interval }
          : { kilometers: parseInt(kilometers) }),
        tasks: tasks.filter((task) => task.trim() !== ""),
        createdByUser: true,
      };

      // Add task to storage
      await addUserTask(newTask);

      // Show success message
      Alert.alert("نجاح", "تمت إضافة المهمة بنجاح", [
        {
          text: "موافق",
          onPress: () => navigate.push("/"),
        },
      ]);

      // Reset form or navigate back
      setTitle("");
      setDescription("");
      setTasks([""]);
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء إضافة المهمة");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
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

        {/* Conditional Fields */}
        {type === "time-based" ? (
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-800 mb-2">
              الفترة
            </Text>
            <View className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <Picker
                selectedValue={interval}
                onValueChange={(itemValue) => setInterval(itemValue)}
              >
                <Picker.Item label="كل أسبوعين" value="biweekly" />
                <Picker.Item label="شهري" value="monthly" />
                <Picker.Item label="ربع سنوي" value="quarterly" />
                <Picker.Item label="نصف سنوي" value="semiannual" />
                <Picker.Item label="سنوي" value="annual" />
                <Picker.Item label="كل سنتين" value="biennial" />
                <Picker.Item label="كل ثلاث سنوات" value="triennial" />
              </Picker>
            </View>
          </View>
        ) : (
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
              <View key={index} className="flex-row items-center gap-2 mt-2">
                <TextInput
                  value={task}
                  onChangeText={(text) => updateTask(text, index)}
                  className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
                  placeholder="أدخل المهمة"
                />
                <TouchableOpacity
                  onPress={() => removeTask(index)}
                  className="bg-rose-100 p-3 rounded-xl"
                >
                  <Ionicons name="trash-outline" size={24} color="#e11d48" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={addTask}
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
