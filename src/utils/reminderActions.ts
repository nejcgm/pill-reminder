import { Medicine } from '../types';
import { addMinutes } from 'date-fns';
import { updateMedicine, getMedicines } from '../storage';
import {
  cancelAllNotifications,
  scheduleNotificationForMedicine,
} from '../notifications';

export const handleTake = async (medicine: Medicine): Promise<void> => {
  try {
    await cancelAllNotifications();
    
    const updatedMedicine = { ...medicine, taken: true };
    await updateMedicine(updatedMedicine);
    
    const allMedicines = await getMedicines();
    for (const med of allMedicines) {
      if (med.id !== medicine.id && !med.taken) {
        await scheduleNotificationForMedicine(med);
      }
    }
  } catch (error) {
    console.error('Error in handleTake:', error);
    throw error;
  }
};

export const handleSnooze = async (medicine: Medicine, snoozeMinutes?: number): Promise<void> => {
  try {
    await cancelAllNotifications();
    
    const snoozeTime = snoozeMinutes || medicine.snoozeTime;
    const startAt = addMinutes(new Date(), snoozeTime);
    // Reset the cycle to start after the chosen snooze
    await scheduleNotificationForMedicine(medicine, startAt);
    
    const allMedicines = await getMedicines();
    for (const med of allMedicines) {
      if (med.id !== medicine.id && !med.taken) {
        await scheduleNotificationForMedicine(med);
      }
    }
  } catch (error) {
    console.error('Error in handleSnooze:', error);
    throw error;
  }
};


