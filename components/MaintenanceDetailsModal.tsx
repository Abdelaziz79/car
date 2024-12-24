import GradientButton from "@/components/GradientButton";
import { MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MaintenanceDetailsModalProps {
  selectedItem: MaintenanceItem | null;
  onClose: () => void;
}

const MaintenanceDetailsModal: React.FC<MaintenanceDetailsModalProps> = ({
  selectedItem,
  onClose,
}) => {
  if (!selectedItem) return null;

  return (
    <Modal
      visible={!!selectedItem}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/30">
        <View className="bg-white rounded-t-3xl p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-slate-800">
              تفاصيل الصيانة
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-slate-100"
            >
              <Ionicons name="close" size={24} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[70vh]">
            {/* Title and Description */}
            <Text className="text-xl font-bold text-slate-800 mb-2">
              {selectedItem.title}
            </Text>
            {selectedItem.description && (
              <Text className="text-slate-600 text-base mb-6 leading-6">
                {selectedItem.description}
              </Text>
            )}

            {/* Metadata */}
            <View className="bg-slate-50 rounded-xl p-4 mb-6">
              {/* Interval */}
              {selectedItem.interval && (
                <View className="flex-row items-center mb-3">
                  <Ionicons name="time-outline" size={20} color="#8B5CF6" />
                  <Text className="text-slate-600 mx-2">
                    كل {selectedItem.interval}
                  </Text>
                </View>
              )}

              {/* Kilometers */}
              {selectedItem.kilometers && (
                <View className="flex-row items-center mb-3">
                  <Ionicons
                    name="speedometer-outline"
                    size={20}
                    color="#8B5CF6"
                  />
                  <Text className="text-slate-600 mx-2">
                    كل {selectedItem.kilometers} كم
                  </Text>
                </View>
              )}

              {/* Next Date */}
              {selectedItem.nextDate && (
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                  <Text className="text-slate-600 mx-2">
                    الموعد القادم: {formatDate(selectedItem.nextDate)}
                  </Text>
                </View>
              )}
            </View>

            {/* Tags */}
            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-slate-800 mb-3">
                  التصنيفات
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-violet-100 px-3 py-1.5 rounded-full"
                    >
                      <Ionicons name="pricetag" size={16} color="#8B5CF6" />
                      <Text className="text-violet-700 mx-1">{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Tasks */}
            {selectedItem.tasks && selectedItem.tasks.length > 0 && (
              <>
                <Text className="text-lg font-bold text-slate-800 mb-3">
                  المهام:
                </Text>
                <View className="bg-slate-50 rounded-xl p-4 mb-6">
                  {selectedItem.tasks.map((task, index) => (
                    <View
                      key={index}
                      className="flex-row items-center mb-3 last:mb-0"
                    >
                      <View className="w-2 h-2 rounded-full bg-violet-500 mx-3" />
                      <Text className="text-slate-700">{task}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Completion History */}
            {selectedItem.completionHistory &&
              selectedItem.completionHistory.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-bold text-slate-800 mb-3">
                    سجل الإنجاز
                  </Text>
                  {selectedItem.completionHistory.map((completion, index) => (
                    <View
                      key={index}
                      className="bg-slate-50 rounded-xl p-4 mb-2 last:mb-0"
                    >
                      <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center">
                          <Ionicons name="calendar" size={16} color="#8B5CF6" />
                          <Text className="font-medium text-slate-700 mx-1">
                            {formatDate(completion.completionDate)}
                          </Text>
                        </View>
                        {completion.kmAtCompletion !== null && (
                          <View className="flex-row items-center">
                            <Ionicons
                              name="speedometer"
                              size={16}
                              color="#8B5CF6"
                            />
                            <Text className="text-slate-600 mx-1">
                              {completion.kmAtCompletion} كم
                            </Text>
                          </View>
                        )}
                      </View>
                      {completion.notes && (
                        <View className="bg-violet-50 rounded-lg p-3 mt-2">
                          <Text className="text-slate-700">
                            {completion.notes}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
          </ScrollView>

          {/* Close Button */}
          <View className="mt-4">
            <GradientButton onPress={onClose} title="إغلاق" icon="close" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MaintenanceDetailsModal;
