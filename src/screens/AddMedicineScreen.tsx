
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Medicine } from '../types';
import { saveMedicine } from '../storage';
import { scheduleNotificationForMedicine } from '../notifications';
import styles from './styles/AddMedicineScreen.styles';
import TimeCarousel from '../components/TimeCarousel';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMedicine'>;

export default function AddMedicineScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [repeatInterval, setRepeatInterval] = useState('');
  const [maxRepeats, setMaxRepeats] = useState('');
  const [snoozeTime, setSnoozeTime] = useState('');
  const [saving, setSaving] = useState(false);

  const validateTime = (timeStr: string): boolean => {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(timeStr);
  };

  const handleSave = async () => {
    if (saving) return;
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter medicine name');
      return;
    }

    if (!validateTime(time)) {
      Alert.alert('Error', 'Please enter time in HH:mm format (e.g., 09:30)');
      return;
    }

    const repeatIntervalNum = parseInt(repeatInterval) || 0;
    const maxRepeatsNum = parseInt(maxRepeats) || 0;
    const snoozeTimeNum = parseInt(snoozeTime) || 5;

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: name.trim(),
      time: time.trim(),
      repeatInterval: repeatIntervalNum,
      maxRepeats: maxRepeatsNum,
      snoozeTime: snoozeTimeNum,
      taken: false,
    };

    try {
      setSaving(true);
      await saveMedicine(medicine);
      await scheduleNotificationForMedicine(medicine);
      Alert.alert('Success', 'Medicine added and notifications scheduled!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save medicine');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.screen} nestedScrollEnabled>
      <View style={styles.container}>
        <Text style={styles.label}>Medicine Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Medicine"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Time of Reminder</Text>
        <View style={{ marginBottom: 20 }}>
          <TimeCarousel
            value={time || '09:00'}
            onChange={setTime}
            hourFormat={24}
            minuteStep={1}
            orientation="vertical"
          />
        </View>

        <Text style={styles.label}>Repeat Interval (minutes)</Text>
        <TextInput
          style={styles.input}
          value={repeatInterval}
          onChangeText={setRepeatInterval}
          placeholder="Interval"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Max Repeats</Text>
        <TextInput
          style={styles.input}
          value={maxRepeats}
          onChangeText={setMaxRepeats}
          placeholder="Repeats"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Snooze Time (minutes)</Text>
        <TextInput
          style={styles.input}
          value={snoozeTime}
          onChangeText={setSnoozeTime}
          placeholder="Snooze"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Medicine</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
 