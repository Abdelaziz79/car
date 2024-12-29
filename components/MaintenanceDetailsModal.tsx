import GradientButton from "@/components/GradientButton";
import { CompletionData, MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { formatIntervalDisplay } from "@/utils/storageHelpers";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CompleteModel from "./CompleteModel";
import EditModel from "./EditModel";
import TagElement from "./TagElement";

interface MaintenanceDetailsModalProps {
  selectedItem: MaintenanceItem | null;
  onClose: () => void;
  onComplete: (id: string, completionData: CompletionData) => void;
  onDelete: (id: string) => void;
  currentKm: number;
  handleUpdateTask: (
    id: string,
    updates: Partial<MaintenanceItem>,
    setLoading?: (loading: boolean) => void,
    onSuccess?: () => void
  ) => any;
  onRefresh: () => void;
  isRTL: boolean;
  directionLoaded: boolean;
}

const MaintenanceDetailsModal: React.FC<MaintenanceDetailsModalProps> = ({
  selectedItem,
  onClose,
  onComplete,
  onDelete,
  currentKm,
  handleUpdateTask,
  onRefresh,
  isRTL,
  directionLoaded,
}) => {
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      maintenanceDetails: isRTL ? "تفاصيل الصيانة" : "Maintenance Details",
      close: isRTL ? "إغلاق" : "Close",
      complete: isRTL ? "إكمال" : "Complete",
      edit: isRTL ? "تعديل" : "Edit",
      delete: isRTL ? "حذف" : "Delete",
      every: isRTL ? "كل" : "Every",
      nextDate: isRTL ? "الموعد القادم" : "Next Date",
      nextKm: isRTL ? "الموعد القادم" : "Next Date",
      tags: isRTL ? "التصنيفات" : "Tags",
      tasks: isRTL ? "المهام" : "Tasks",
      completionHistory: isRTL ? "سجل الإنجاز" : "Completion History",
      deleteTaskTitle: isRTL ? "حذف المهمة" : "Delete Task",
      deleteTaskMessage: isRTL
        ? "هل تريد حذف هذه المهمة؟"
        : "Do you want to delete this task?",
      cancel: isRTL ? "إلغاء" : "Cancel",
    };
    return textMap[key] || key;
  };

  if (!directionLoaded) {
    return null;
  }

  if (!selectedItem) return null;

  return (
    <>
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View
          className="flex-1 justify-end bg-black/50"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl border border-slate-100">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
              <Text
                className="text-3xl font-bold text-slate-800 tracking-tight"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("maintenanceDetails")}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2.5 rounded-full bg-slate-100 active:bg-slate-200 shadow-sm"
              >
                <Ionicons name="close" size={24} color="#475569" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="max-h-[60vh]"
              showsVerticalScrollIndicator={false}
            >
              {/* Title and Description */}
              <View className="flex-row justify-between">
                <Text
                  className="text-2xl font-bold text-slate-800 mb-3"
                  style={{
                    writingDirection: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {selectedItem.title}
                </Text>
              </View>
              {selectedItem.description && (
                <Text
                  className="text-slate-600 text-base mb-8 leading-7"
                  style={{
                    writingDirection: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {selectedItem.description}
                </Text>
              )}

              {/* Metadata */}
              {selectedItem.type !== "undefined" && (
                <View className="bg-violet-50 rounded-2xl p-5 mb-8 shadow-sm border border-violet-100">
                  {/* Interval */}
                  {selectedItem.interval && (
                    <View className="flex-row items-center mb-4">
                      <View className="bg-violet-200 p-2 rounded-full">
                        <Ionicons
                          name="time-outline"
                          size={22}
                          color="#8B5CF6"
                        />
                      </View>
                      <Text
                        className="text-slate-700 text-lg mx-3 font-medium"
                        style={{
                          writingDirection: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        {formatIntervalDisplay(
                          selectedItem.interval,
                          isRTL ? "ar" : "en"
                        )}
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
                      <Text
                        className="text-slate-700 text-lg mx-3 font-medium"
                        style={{
                          writingDirection: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        {getText("every")} {selectedItem.kilometers} كم
                      </Text>
                    </View>
                  )}

                  {/* Next Date */}
                  {selectedItem.nextDate ? (
                    <View className="flex-row items-center">
                      <View className="bg-violet-200 p-2 rounded-full">
                        <Ionicons
                          name="calendar-outline"
                          size={22}
                          color="#8B5CF6"
                        />
                      </View>
                      <Text
                        className="text-slate-700 text-lg mx-3 font-medium"
                        style={{
                          writingDirection: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        {getText("nextDate")}:{" "}
                        {formatDate(
                          selectedItem.nextDate,
                          isRTL ? "ar-SA" : "en-US"
                        )}
                      </Text>
                    </View>
                  ) : (
                    selectedItem.nextKm && (
                      <View className="flex-row items-center">
                        <View className="bg-violet-200 p-2 rounded-full">
                          <Ionicons
                            name="rocket-outline"
                            size={22}
                            color="#8B5CF6"
                          />
                        </View>
                        <Text
                          className="text-slate-700 text-lg mx-3 font-medium"
                          style={{
                            writingDirection: isRTL ? "rtl" : "ltr",
                          }}
                        >
                          {getText("nextKm")}: عند {selectedItem.nextKm} كم
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}

              {/* Tags */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <View className="mb-8">
                  <Text
                    className="text-xl font-bold text-slate-800 mb-4"
                    style={{
                      writingDirection: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {getText("tags")}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {selectedItem.tags.map((tag, index) => (
                      <TagElement key={index} tagName={tag} />
                    ))}
                  </View>
                </View>
              )}

              {/* Tasks */}
              {selectedItem.tasks && selectedItem.tasks.length > 0 && (
                <>
                  <Text
                    className="text-xl font-bold text-slate-800 mb-4"
                    style={{
                      writingDirection: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {getText("tasks")}
                  </Text>
                  <View className="bg-slate-50 rounded-2xl p-5 mb-8 shadow-sm border border-slate-100">
                    {selectedItem.tasks.map((task, index) => (
                      <View
                        key={index}
                        className="flex-row items-center mb-4 last:mb-0"
                      >
                        <View className="w-2.5 h-2.5 rounded-full bg-violet-500 mx-3" />
                        <Text
                          className="text-slate-700 text-base"
                          style={{
                            writingDirection: isRTL ? "rtl" : "ltr",
                          }}
                        >
                          {task}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Completion History */}
              {selectedItem.completionHistory &&
                selectedItem.completionHistory.length > 0 && (
                  <View className="mb-8">
                    <Text
                      className="text-xl font-bold text-slate-800 mb-4"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {getText("completionHistory")}
                    </Text>
                    {selectedItem.completionHistory.map((completion, index) => (
                      <View
                        key={index}
                        className="bg-slate-50 rounded-2xl p-5 mb-3 last:mb-0 shadow-sm border border-slate-100 mt-2"
                      >
                        <View className="flex-row gap-y-2 flex-wrap justify-between items-center mb-3">
                          <View className="flex-row items-center">
                            <View className="bg-violet-200 p-1.5 rounded-full">
                              <Ionicons
                                name="calendar"
                                size={18}
                                color="#8B5CF6"
                              />
                            </View>
                            <Text
                              className="font-medium text-slate-700 text-base mx-2"
                              style={{
                                writingDirection: isRTL ? "rtl" : "ltr",
                              }}
                            >
                              {formatDate(
                                completion.completionDate,
                                isRTL ? "ar-SA" : "en-US"
                              )}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <View className="bg-violet-200 p-1.5 rounded-full">
                              <Ionicons
                                name="cash-outline"
                                size={18}
                                color="#8B5CF6"
                              />
                            </View>
                            <Text
                              className="text-slate-700 text-base mx-2"
                              style={{
                                writingDirection: isRTL ? "rtl" : "ltr",
                              }}
                            >
                              {completion.cost} $
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
                              <Text
                                className="text-slate-700 text-base mx-2"
                                style={{
                                  writingDirection: isRTL ? "rtl" : "ltr",
                                }}
                              >
                                {completion.kmAtCompletion}{" "}
                                {isRTL ? "كم" : "km"}
                              </Text>
                            </View>
                          )}
                        </View>
                        {completion.notes && (
                          <View className="bg-violet-50 rounded-xl p-4 mt-3 border border-violet-100">
                            <Text
                              className="text-slate-700 leading-6"
                              style={{
                                writingDirection: isRTL ? "rtl" : "ltr",
                              }}
                            >
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
            <View className="flex-col gap-3  border-t border-slate-100 pt-3">
              <View className="flex-row gap-3 ">
                <TouchableOpacity
                  onPress={() => setCompletionModalVisible(true)}
                  className="flex-1 flex-row items-center justify-center bg-violet-100 p-4 rounded-xl active:bg-violet-200"
                >
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={24}
                    color="#8B5CF6"
                  />
                  <Text
                    className="text-violet-700 text-base font-medium mx-2"
                    style={{
                      writingDirection: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {getText("complete")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUpdateModalVisible(true)}
                  className="flex-1 flex-row items-center justify-center bg-emerald-100 p-4 rounded-xl active:bg-emerald-200"
                >
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={24}
                    color="#10B981"
                  />
                  <Text
                    className="text-emerald-700 text-base font-medium mx-2"
                    style={{
                      writingDirection: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {getText("edit")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      getText("deleteTaskTitle"),
                      getText("deleteTaskMessage"),
                      [
                        {
                          text: getText("cancel"),
                          onPress: () => {},
                          style: "cancel",
                        },
                        {
                          text: getText("delete"),
                          onPress: () => {
                            onDelete(selectedItem.id);
                            onClose();
                          },
                        },
                      ]
                    );
                  }}
                  className="flex-1 flex-row items-center justify-center bg-red-100 p-4 rounded-xl active:bg-red-200"
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color="#EF4444"
                  />
                  <Text
                    className="text-red-700 text-base font-medium mx-2"
                    style={{
                      writingDirection: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {getText("delete")}
                  </Text>
                </TouchableOpacity>
              </View>

              <GradientButton
                title={getText("close")}
                icon="close"
                onPress={onClose}
              />
            </View>
          </View>
        </View>
      </Modal>

      <CompleteModel
        item={selectedItem}
        currentKm={currentKm}
        onComplete={onComplete}
        completionModalVisible={completionModalVisible}
        setCompletionModalVisible={setCompletionModalVisible}
        action={onClose}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
      />

      <EditModel
        item={selectedItem}
        onUpdate={handleUpdateTask}
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        onRefresh={onRefresh}
        closeDetailsModel={onClose}
      />
    </>
  );
};

export default MaintenanceDetailsModal;
