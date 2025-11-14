import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medicine } from '../types';

const MEDICINES_KEY = '@medicines';
const LAST_RESET_KEY = '@last_reset';

export const saveMedicine = async (medicine: Medicine): Promise<void> => {
  try {
    const medicines = await getMedicines();
    medicines.push(medicine);
    await AsyncStorage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
  } catch (error) {
    console.error('Error saving medicine:', error);
    throw error;
  }
};

export const getMedicines = async (): Promise<Medicine[]> => {
  try {
    const data = await AsyncStorage.getItem(MEDICINES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting medicines:', error);
    return [];
  }
};

export const updateMedicine = async (updatedMedicine: Medicine): Promise<void> => {
  try {
    const medicines = await getMedicines();
    const index = medicines.findIndex(m => m.id === updatedMedicine.id);
    
    if (index !== -1) {
      medicines[index] = updatedMedicine;
      await AsyncStorage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
    }
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
};

export const deleteMedicine = async (id: string): Promise<void> => {
  try {
    const medicines = await getMedicines();
    const filtered = medicines.filter(m => m.id !== id);
    await AsyncStorage.setItem(MEDICINES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
};

export const getLastResetDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LAST_RESET_KEY);
  } catch (error) {
    console.error('Error getting last reset date:', error);
    return null;
  }
};

export const setLastResetDate = async (date: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_RESET_KEY, date);
  } catch (error) {
    console.error('Error setting last reset date:', error);
    throw error;
  }
};


