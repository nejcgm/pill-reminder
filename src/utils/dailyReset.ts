import { format, isAfter, parseISO, startOfDay } from 'date-fns';
import { getMedicines, updateMedicine, getLastResetDate, setLastResetDate } from '../storage';
import { scheduleNotificationForMedicine } from '../notifications';

export const checkAndResetDaily = async (): Promise<void> => {
  try {
    const lastResetStr = await getLastResetDate();
    const today = startOfDay(new Date());
    const todayStr = format(today, 'yyyy-MM-dd');

    if (!lastResetStr || lastResetStr !== todayStr) {
      await resetAllMedicines();
      await setLastResetDate(todayStr);
    }
  } catch (error) {
    console.error('Error in checkAndResetDaily:', error);
  }
};

export const resetAllMedicines = async (): Promise<void> => {
  try {
    const medicines = await getMedicines();
    
    for (const medicine of medicines) {
      if (medicine.taken) {
        const resetMedicine = { ...medicine, taken: false };
        await updateMedicine(resetMedicine);
        await scheduleNotificationForMedicine(resetMedicine);
      }
    }
  } catch (error) {
    console.error('Error in resetAllMedicines:', error);
    throw error;
  }
};

export const shouldReset = async (): Promise<boolean> => {
  try {
    const lastResetStr = await getLastResetDate();
    
    if (!lastResetStr) {
      return true;
    }

    const lastResetDate = parseISO(lastResetStr);
    const today = startOfDay(new Date());
    
    return isAfter(today, lastResetDate);
  } catch (error) {
    console.error('Error in shouldReset:', error);
    return false;
  }
};


