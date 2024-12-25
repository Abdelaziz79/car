import GradientButton from "@/components/GradientButton";
import { CompletionData, MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MaintenanceDetailsModalProps {
  selectedItem: MaintenanceItem | null;
  onClose: () => void;
  onComplete: (id: string, completionData: CompletionData) => void;
  onDelete: (id: string) => void;
}

const MaintenanceDetailsModal: React.FC<MaintenanceDetailsModalProps> = ({
  selectedItem,
  onClose,
  onComplete,
  onDelete,
}) => {
  if (!selectedItem) return null;

  return (
    <Modal
      visible={!!selectedItem}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 shadow-2xl border border-slate-100">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-3xl font-bold text-slate-800 tracking-tight">
              تفاصيل الصيانة
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2.5 rounded-full bg-slate-100 active:bg-slate-200 shadow-sm"
            >
              <Ionicons name="close" size={24} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="max-h-[65vh]"
            showsVerticalScrollIndicator={false}
          >
            {/* Title and Description */}
            <Text className="text-2xl font-bold text-slate-800 mb-3">
              {selectedItem.title}
            </Text>
            {selectedItem.description && (
              <Text className="text-slate-600 text-base mb-8 leading-7">
                {selectedItem.description}
              </Text>
            )}

            {/* Metadata */}
            <View className="bg-violet-50 rounded-2xl p-5 mb-8 shadow-sm border border-violet-100">
              {/* Interval */}
              {selectedItem.interval && (
                <View className="flex-row items-center mb-4">
                  <View className="bg-violet-200 p-2 rounded-full">
                    <Ionicons name="time-outline" size={22} color="#8B5CF6" />
                  </View>
                  <Text className="text-slate-700 text-lg mx-3 font-medium">
                    كل {selectedItem.interval}
                  </Text>
                </View>
              )}

              {/* Kilometers */}
              {selectedItem.kilometers && (
                <View className="flex-row items-center mb-4">
                  <View className="bg-violet-200 p-2 rounded-full">
                    <Ionicons
                      name="speedometer-outline"
                      size={22}
                      color="#8B5CF6"
                    />
                  </View>
                  <Text className="text-slate-700 text-lg mx-3 font-medium">
                    كل {selectedItem.kilometers} كم
                  </Text>
                </View>
              )}

              {/* Next Date */}
              {selectedItem.nextDate && (
                <View className="flex-row items-center">
                  <View className="bg-violet-200 p-2 rounded-full">
                    <Ionicons
                      name="calendar-outline"
                      size={22}
                      color="#8B5CF6"
                    />
                  </View>
                  <Text className="text-slate-700 text-lg mx-3 font-medium">
                    الموعد القادم: {formatDate(selectedItem.nextDate)}
                  </Text>
                </View>
              )}
            </View>

            {/* Tags */}
            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <View className="mb-8">
                <Text className="text-xl font-bold text-slate-800 mb-4">
                  التصنيفات
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-violet-100 px-4 py-2 rounded-full shadow-sm border border-violet-200"
                    >
                      <Ionicons name="pricetag" size={18} color="#8B5CF6" />
                      <Text className="text-violet-700 mx-2 font-medium">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Tasks */}
            {selectedItem.tasks && selectedItem.tasks.length > 0 && (
              <>
                <Text className="text-xl font-bold text-slate-800 mb-4">
                  المهام:
                </Text>
                <View className="bg-slate-50 rounded-2xl p-5 mb-8 shadow-sm border border-slate-100">
                  {selectedItem.tasks.map((task, index) => (
                    <View
                      key={index}
                      className="flex-row items-center mb-4 last:mb-0"
                    >
                      <View className="w-2.5 h-2.5 rounded-full bg-violet-500 mx-3" />
                      <Text className="text-slate-700 text-base">{task}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Completion History */}
            {selectedItem.completionHistory &&
              selectedItem.completionHistory.length > 0 && (
                <View className="mb-8">
                  <Text className="text-xl font-bold text-slate-800 mb-4">
                    سجل الإنجاز
                  </Text>
                  {selectedItem.completionHistory.map((completion, index) => (
                    <View
                      key={index}
                      className="bg-slate-50 rounded-2xl p-5 mb-3 last:mb-0 shadow-sm border border-slate-100"
                    >
                      <View className="flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center">
                          <View className="bg-violet-200 p-1.5 rounded-full">
                            <Ionicons
                              name="calendar"
                              size={18}
                              color="#8B5CF6"
                            />
                          </View>
                          <Text className="font-medium text-slate-700 text-base mx-2">
                            {formatDate(completion.completionDate)}
                          </Text>
                        </View>
                        {completion.kmAtCompletion !== null && (
                          <View className="flex-row items-center">
                            <View className="bg-violet-200 p-1.5 rounded-full">
                              <Ionicons
                                name="speedometer"
                                size={18}
                                color="#8B5CF6"
                              />
                            </View>
                            <Text className="text-slate-700 text-base mx-2">
                              {completion.kmAtCompletion} كم
                            </Text>
                          </View>
                        )}
                      </View>
                      {completion.notes && (
                        <View className="bg-violet-50 rounded-xl p-4 mt-3 border border-violet-100">
                          <Text className="text-slate-700 leading-6">
                            {completion.notes}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
          </ScrollView>

          {/* Action Buttons */}
          <View className=" ">
            <GradientButton title="إغلاق" icon="close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MaintenanceDetailsModal;

// TODO : Add a delete button
// TODO : Add a complete button you have complete modal
// TODO : Add next update for KM
