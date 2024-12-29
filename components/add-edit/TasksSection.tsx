import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface TasksSectionProps {
  tasks: string[];
  setTasks: (tasks: string[]) => void;
  className?: string;
  childClassName?: string;
  text?: string;
  isRTL: boolean;
  directionLoaded: boolean;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  setTasks,
  className = "mb-6",
  childClassName,
  text,
  isRTL,
  directionLoaded,
}) => {
  if (!directionLoaded) {
    return null;
  }

  const getPlaceholder = () => {
    return isRTL ? "أدخل المهمة" : "Enter task";
  };

  const getLabel = () => {
    return isRTL ? "المهام" : "Tasks";
  };

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
    <View
      className={`${className}`}
      style={{
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <Text className="text-lg font-bold text-slate-800 mb-2">
        {text || getLabel()}
      </Text>
      <View className="space-y-3 w-full">
        {tasks.map((task, index) => (
          <View
            key={`task-${index}`}
            className="flex-row items-center gap-2 mt-2"
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <TextInput
              value={task}
              onChangeText={(text) => handleTaskChange(text, index)}
              className={`flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800 ${childClassName}`}
              placeholder={getPlaceholder()}
              style={{
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
              textAlign={isRTL ? "right" : "left"}
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
        className="mt-3 flex-row items-center justify-center bg-violet-100 p-3 rounded-xl w-full"
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <Ionicons name="add" size={24} color="#7c3aed" />
        <Text
          className="text-violet-700 font-medium"
          style={{
            marginRight: isRTL ? 0 : 8,
            marginLeft: isRTL ? 8 : 0,
          }}
        >
          {isRTL ? "إضافة مهمة" : "Add Task"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TasksSection;
