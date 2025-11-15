import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
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
  const [loadingByKey, setLoadingByKey] = useState<Record<string, boolean>>({});
  const [bulkLoading, setBulkLoading] = useState<{ takeAll: boolean; snoozeAll: boolean }>({
    takeAll: false,
    snoozeAll: false,
  });

  const setLoading = (key: string, value: boolean) =>
    setLoadingByKey((prev) => ({ ...prev, [key]: value }));

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
    const key = `${medicine.id}:take`;
    try {
      setLoading(key, true);
      await handleTakeAction(medicine);
      Alert.alert("Success", `${medicine.name} marked as taken`);
      loadMedicines();
    } catch (error) {
      Alert.alert("Error", "Failed to mark medicine as taken");
    } finally {
      setLoading(key, false);
    }
  };

  const handleSnooze = async (medicine: Medicine) => {
    const key = `${medicine.id}:snooze`;
    try {
      setLoading(key, true);
      await handleSnoozeAction(medicine);
      Alert.alert(
        "Success",
        `${medicine.name} snoozed for ${medicine.snoozeTime} minutes`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to snooze medicine");
    } finally {
      setLoading(key, false);
    }
  };

  const handleWontTake = async (medicine: Medicine) => {
    const key = `${medicine.id}:wont`;
    try {
      setLoading(key, true);
      await handleTakeAction(medicine);
      Alert.alert("Noted", `${medicine.name} marked as won't take`);
      loadMedicines();
    } catch (error) {
      Alert.alert("Error", "Failed to mark medicine");
    } finally {
      setLoading(key, false);
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
            const key = `${medicine.id}:remove`;
            try {
              setLoading(key, true);
              await Notifications.cancelAllScheduledNotificationsAsync();
              await deleteMedicine(medicine.id);
              Alert.alert("Success", `${medicine.name} removed`);
              loadMedicines();
            } catch (error) {
              Alert.alert("Error", "Failed to remove medicine");
            } finally {
              setLoading(key, false);
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
              setBulkLoading((b) => ({ ...b, takeAll: true }));
              await Promise.all(
                pendingMedicines.map((m) => handleTakeAction(m))
              );
              Alert.alert("Success", `All medicines marked as taken`);
              loadMedicines();
            } catch (error) {
              Alert.alert("Error", "Failed to mark all medicines as taken");
            } finally {
              setBulkLoading((b) => ({ ...b, takeAll: false }));
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
              setBulkLoading((b) => ({ ...b, snoozeAll: true }));
              await Promise.all(
                pendingMedicines.map((m) => handleSnoozeAction(m))
              );
              Alert.alert("Success", `All medicines snoozed`);
            } catch (error) {
              Alert.alert("Error", "Failed to snooze all medicines");
            } finally {
              setBulkLoading((b) => ({ ...b, snoozeAll: false }));
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
          {(() => {
            const isTaking = !!loadingByKey[`${item.id}:take`];
            const isSnoozing = !!loadingByKey[`${item.id}:snooze`];
            const isWont = !!loadingByKey[`${item.id}:wont`];
            const isRemoving = !!loadingByKey[`${item.id}:remove`];
            const disabled = isTaking || isSnoozing || isWont || isRemoving;
            return (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.bgRed, disabled && { opacity: 0.7 }]}
                  onPress={() => handleWontTake(item)}
                  disabled={disabled}
                >
                  {isWont ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.actionButtonText}>Won't Take</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ml8, styles.bgBlue, disabled && { opacity: 0.7 }]}
                  onPress={() => handleSnooze(item)}
                  disabled={disabled}
                >
                  {isSnoozing ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.actionButtonText}>Snooze</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.ml8, styles.bgGreen, disabled && { opacity: 0.7 }]}
                  onPress={() => handleTake(item)}
                  disabled={disabled}
                >
                  {isTaking ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.actionButtonText}>Take</Text>
                  )}
                </TouchableOpacity>
              </>
            );
          })()}
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
            disabled={bulkLoading.snoozeAll || bulkLoading.takeAll}
          >
            {bulkLoading.snoozeAll ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.bulkButtonText}>Snooze All</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bulkButton, styles.ml8, styles.bgGreen]}
            onPress={handleTakeAll}
            disabled={bulkLoading.takeAll || bulkLoading.snoozeAll}
          >
            {bulkLoading.takeAll ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.bulkButtonText}>Take All</Text>
            )}
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
