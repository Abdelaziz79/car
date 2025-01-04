import { MaintenanceItem, MaintenanceType, Tags } from "@/types/allTypes";
import { StorageManager } from "@/utils/storageHelpers";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

const convertTaskToCSVRow = (task: MaintenanceItem): string => {
  const completionHistoryString = task.completionHistory
    ? JSON.stringify(task.completionHistory)
        .replace(/"/g, '""') // Double the quotes inside JSON
        .replace(/[\u0000-\u001F]/g, "") // Remove control characters
    : "";

  return [
    `"${task.id}"`,
    `"${task.title}"`,
    `"${task.description}"`,
    `"${task.type}"`,
    `"${task.interval || ""}"`,
    task.kilometers || "",
    `"${task.lastDate || ""}"`,
    `"${task.nextDate || ""}"`,
    task.lastKm || "",
    task.nextKm || "",
    `"${task.tags?.join(";") || ""}"`,
    `"${task.tasks.join(";")}"`,
    task.createdByUser || false,
    task.isRecurring || false,
    `"${completionHistoryString}"`,
  ].join(",");
};

const parseCSVRow = (row: string): MaintenanceItem => {
  // Split by comma but preserve commas within quotes
  const regex = /(?:^|,)("(?:[^"]*"")*[^"]*"|[^,]*)/g;
  const values: string[] = [];
  let match;

  while ((match = regex.exec(row))) {
    let value = match[1];
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1); // Remove surrounding quotes
      value = value.replace(/""/g, '"'); // Replace double quotes with single quotes
    }
    values.push(value.trim());
  }

  let completionHistory = [];
  try {
    if (values[14]) {
      // Clean the JSON string before parsing
      const cleanedJSON = values[14]
        .replace(/[\u0000-\u001F]/g, "") // Remove control characters
        .trim();
      completionHistory = JSON.parse(cleanedJSON);
    }
  } catch (error) {
    completionHistory = []; // Fallback to empty array if parsing fails
  }

  return {
    id: values[0],
    title: values[1],
    description: values[2],
    type: values[3] as MaintenanceType,
    interval: values[4] || undefined,
    kilometers: values[5] ? Number(values[5]) : undefined,
    lastDate: values[6] || undefined,
    nextDate: values[7] || undefined,
    lastKm: values[8] ? Number(values[8]) : undefined,
    nextKm: values[9] ? Number(values[9]) : undefined,
    tags: values[10] ? (values[10].split(";") as Tags[]) : [],
    tasks: values[11] ? values[11].split(";") : [],
    createdByUser: values[12] === "true",
    isRecurring: values[13] === "true",
    completionHistory,
  };
};

export const importTasksFromCSV = async (isRTL: boolean) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    if (result.assets && result.assets[0]) {
      const file = result.assets[0];

      try {
        const fileContent = await FileSystem.readAsStringAsync(file.uri);

        // Basic CSV validation
        if (!fileContent.includes("id,title,description,type")) {
          throw new Error("Invalid CSV format: Missing required headers");
        }

        const lines = fileContent
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/\r$/, "")); // Remove any trailing \r characters

        // Skip header row and parse data
        const importedTasks = lines.slice(1).map((line, index) => {
          try {
            return parseCSVRow(line);
          } catch (error) {
            throw new Error(`Error parsing row ${index + 2}: ${error}`);
          }
        });

        // Validate imported tasks
        const isValid = importedTasks.every(
          (task) =>
            task.id &&
            task.title &&
            ["time-based", "distance-based", "undefined"].includes(task.type)
        );

        if (!isValid) {
          throw new Error("Invalid task data format");
        }

        // Merge with existing tasks, avoiding duplicates by ID
        const currentTasks = await StorageManager.getMaintenanceData();
        const existingIds = new Set(currentTasks.map((task) => task.id));
        const newTasks = importedTasks.filter(
          (task) => !existingIds.has(task.id)
        );
        const mergedTasks = [...currentTasks, ...newTasks];

        await StorageManager.saveMaintenanceData(mergedTasks);

        Alert.alert(
          isRTL ? "نجاح" : "Success",
          isRTL ? "تم استيراد المهام بنجاح" : "Tasks imported successfully"
        );
      } catch (error) {
        throw new Error(
          isRTL
            ? "خطأ في تحليل ملف CSV. يرجى التأكد من أنه ملف تصدير مهام صالح"
            : "Error parsing the CSV file. Please make sure it's a valid maintenance tasks export file."
        );
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    Alert.alert(
      isRTL ? "خطأ" : "Error",
      isRTL
        ? `حدث خطأ أثناء استيراد المهام: ${errorMessage}`
        : `Error importing tasks: ${errorMessage}`
    );
  }
};

export const exportTasksToCSV = async (isRTL: boolean) => {
  try {
    const tasks = await StorageManager.getMaintenanceData();

    const headers = [
      "id",
      "title",
      "description",
      "type",
      "interval",
      "kilometers",
      "lastDate",
      "nextDate",
      "lastKm",
      "nextKm",
      "tags",
      "tasks",
      "createdByUser",
      "isRecurring",
      "completionHistory",
    ].join(",");

    const csvData = tasks.map(convertTaskToCSVRow);
    const csvContent = [headers, ...csvData].join("\n");

    // Simplified filename without complex timestamp
    const date = new Date().toISOString().split("T")[0];
    const fileName = `maintenance_tasks_${date}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/csv",
        UTI: "public.comma-separated-values-text",
      });
    } else {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL ? "مشاركة الملفات غير متوفرة" : "Sharing is not available"
      );
    }
  } catch (error) {
    Alert.alert(
      isRTL ? "خطأ" : "Error",
      isRTL ? "حدث خطأ أثناء تصدير المهام" : "Error exporting tasks"
    );
  }
};
