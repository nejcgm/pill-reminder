import * as Notifications from 'expo-notifications';
import { addMinutes, setHours, setMinutes, setSeconds, isAfter, addDays } from 'date-fns';
import { Medicine } from '../types';

export const scheduleNotificationForMedicine = async (medicine: Medicine): Promise<string[]> => {
  const notificationIds: string[] = [];

  try {
    const [hours, minutes] = medicine.time.split(':').map(Number);
    let scheduledTime = setSeconds(setMinutes(setHours(new Date(), hours), minutes), 0);

    if (isAfter(new Date(), scheduledTime)) {
      scheduledTime = addDays(scheduledTime, 1);
    }

    const firstNotificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nejc wants you to take your medicine!❤️',
        body: `Remember to take ${medicine.name}`,
        sound: 'take-your-pills-notification.wav',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: scheduledTime,
    });

    notificationIds.push(firstNotificationId);

    if (medicine.maxRepeats > 0 && medicine.repeatInterval > 0) {
      for (let i = 1; i <= medicine.maxRepeats; i++) {
        const repeatTime = addMinutes(scheduledTime, medicine.repeatInterval * i);
        
        const repeatNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Reminder: Nejc wants you to take your medicine!🤨',
            body: `${medicine.name} - Repeat reminder ${i}`,
            sound: 'take-your-pills-notification.wav',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: repeatTime,
        });

        notificationIds.push(repeatNotificationId);
      }
    }

    return notificationIds;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return notificationIds;
  }
};

export const scheduleSnoozeNotification = async (
  medicine: Medicine,
  snoozeMinutes: number
): Promise<string> => {
  try {
    const snoozeTime = addMinutes(new Date(), snoozeMinutes);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'You snoozed Nejc is mad!😡',
        body: `Snoozed reminder for ${medicine.name}`,
        sound: 'take-your-pills-notification.wav',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: snoozeTime,
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling snooze notification:', error);
    throw error;
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
    throw error;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
    throw error;
  }
};

export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};


