import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList, Medicine } from "../types";
import { getMedicines, deleteMedicine } from "../storage";
import {
  handleTake as handleTakeAction,
  handleSnooze as handleSnoozeAction,
} from "../utils/reminderActions";
import * as Notifications from "expo-notifications";
import styles from "./styles/HomeScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadMedicines();
    }, [])
  );

  const loadMedicines = async () => {
    const data = await getMedicines();
    setMedicines(data);
  };

  const handleTake = async (medicine: Medicine) => {
    try {
      await handleTakeAction(medicine);
      Alert.alert("Success", `${medicine.name} marked as taken`);
      loadMedicines();
    } catch (error) {
      Alert.alert("Error", "Failed to mark medicine as taken");
    }
  };

  const handleSnooze = async (medicine: Medicine) => {
    try {
      await handleSnoozeAction(medicine);
      Alert.alert(
        "Success",
        `${medicine.name} snoozed for ${medicine.snoozeTime} minutes`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to snooze medicine");
    }
  };

  const handleWontTake = async (medicine: Medicine) => {
    try {
      // Mark as taken but cancel all notifications (similar to take but with different message)
      await handleTakeAction(medicine);
      Alert.alert("Noted", `${medicine.name} marked as won't take`);
      loadMedicines();
    } catch (error) {
      Alert.alert("Error", "Failed to mark medicine");
    }
  };

  const handleRemove = async (medicine: Medicine) => {
    Alert.alert(
      "Remove Medicine",
      `Are you sure you want to remove ${medicine.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // Cancel all notifications for this medicine
              await Notifications.cancelAllScheduledNotificationsAsync();
              await deleteMedicine(medicine.id);
              Alert.alert("Success", `${medicine.name} removed`);
              loadMedicines();
            } catch (error) {
              Alert.alert("Error", "Failed to remove medicine");
            }
          },
        },
      ]
    );
  };

  const handleTakeAll = async () => {
    const pendingMedicines = medicines.filter((m) => !m.taken);
    if (pendingMedicines.length === 0) {
      Alert.alert("Info", "No pending medicines to take");
      return;
    }

    Alert.alert(
      "Take All",
      `Mark all ${pendingMedicines.length} pending medicines as taken?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take All",
          onPress: async () => {
            try {
              await Promise.all(
                pendingMedicines.map((m) => handleTakeAction(m))
              );
              Alert.alert("Success", `All medicines marked as taken`);
              loadMedicines();
            } catch (error) {
              Alert.alert("Error", "Failed to mark all medicines as taken");
            }
          },
        },
      ]
    );
  };

  const handleSnoozeAll = async () => {
    const pendingMedicines = medicines.filter((m) => !m.taken);
    if (pendingMedicines.length === 0) {
      Alert.alert("Info", "No pending medicines to snooze");
      return;
    }

    Alert.alert(
      "Snooze All",
      `Snooze all ${pendingMedicines.length} pending medicines?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Snooze All",
          onPress: async () => {
            try {
              await Promise.all(
                pendingMedicines.map((m) => handleSnoozeAction(m))
              );
              Alert.alert("Success", `All medicines snoozed`);
            } catch (error) {
              Alert.alert("Error", "Failed to snooze all medicines");
            }
          },
        },
      ]
    );
  };

  const renderMedicine = ({ item }: { item: Medicine }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <View
          style={[
            styles.statusChip,
            { backgroundColor: item.taken ? "#22c55e" : "#f97316" },
          ]}
        >
          <Text style={styles.statusChipText}>
            {item.taken ? "Taken" : "Pending"}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.textBase}>Time: {item.time}</Text>
          {item.repeatInterval > 0 && (
            <Text style={styles.textSecondary}>
              Repeats every {item.repeatInterval} min (max {item.maxRepeats})
            </Text>
          )}
          <Text style={[styles.textSecondary, styles.mb12]}>
            Snooze: {item.snoozeTime} minutes
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => handleRemove(item)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {!item.taken && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.bgRed]}
            onPress={() => handleWontTake(item)}
          >
            <Text style={styles.actionButtonText}>Won't Take</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.ml8, styles.bgBlue]}
            onPress={() => handleSnooze(item)}
          >
            <Text style={styles.actionButtonText}>Snooze</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.ml8, styles.bgGreen]}
            onPress={() => handleTake(item)}
          >
            <Text style={styles.actionButtonText}>Take</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const hasPendingMedicines = medicines.some((m) => !m.taken);

  return (
    <View style={styles.screen}>
      {hasPendingMedicines && (
        <View style={styles.bulkActions}>
          <TouchableOpacity
            style={[styles.bulkButton, styles.bgBlue]}
            onPress={handleSnoozeAll}
          >
            <Text style={styles.bulkButtonText}>Snooze All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bulkButton, styles.ml8, styles.bgGreen]}
            onPress={handleTakeAll}
          >
            <Text style={styles.bulkButtonText}>Take All</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.madeWithLove}>Made With Love for Katrina❤️</Text>

      <FlatList
        data={medicines}
        renderItem={renderMedicine}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.listEmptyContainer}>
            <Text style={styles.listEmptyTitle}>No medicines added yet</Text>
            <Text style={styles.listEmptySubtitle}>
              Tap the + button to add one
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddMedicine")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
