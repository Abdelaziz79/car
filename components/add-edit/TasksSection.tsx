import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const TasksSection = ({
  tasks,
  setTasks,
}: {
  tasks: string[];
  setTasks: any;
}) => {
  const handleTaskChange = (text: string, index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = text;
    setTasks(newTasks);
  };
  const handleRemoveTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };
  const handleAddTask = () => setTasks([...tasks, ""]);

  return (
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
  );
};

export default TasksSection;
