import * as Notifications from 'expo-notifications';
import { addMinutes, setHours, setMinutes, setSeconds, isAfter, addDays } from 'date-fns';
import { Medicine } from '../types';

export const scheduleNotificationForMedicine = async (
  medicine: Medicine,
  startAt?: Date,
  cyclesRemaining: number = 5
): Promise<string[]> => {
  const notificationIds: string[] = [];

  try {
    const [hours, minutes] = medicine.time.split(':').map(Number);
    let cycleStartTime =
      startAt ??
      setSeconds(setMinutes(setHours(new Date(), hours), minutes), 0);

    if (!startAt && isAfter(new Date(), cycleStartTime)) {
      cycleStartTime = addDays(cycleStartTime, 1);
    }

    // Initial notification for this cycle
    const firstNotificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nejc wants you to take your medicine!❤️',
        body: `Remember to take ${medicine.name}`,
        sound: 'take_your_pills_notification',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: cycleStartTime },
    });
    notificationIds.push(firstNotificationId);

    // Repeats for this cycle
    const hasRepeats = medicine.maxRepeats > 0 && medicine.repeatInterval > 0;
    let lastReminderTime = cycleStartTime;
    if (hasRepeats) {
      for (let i = 1; i <= medicine.maxRepeats; i++) {
        lastReminderTime = addMinutes(cycleStartTime, medicine.repeatInterval * i);
        const repeatNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Reminder: Nejc wants you to take your medicine!🤨',
            body: `${medicine.name} - Repeat reminder ${i}`,
            sound: 'take_your_pills_notification',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: lastReminderTime },
        });
        notificationIds.push(repeatNotificationId);
      }
    }

    // Schedule next cycle recursively after snooze, bounded by cyclesRemaining
    const snoozeMinutes = medicine.snoozeTime || 10;
    const nextCycleStart = addMinutes(hasRepeats ? lastReminderTime : cycleStartTime, snoozeMinutes);
    if (cyclesRemaining > 1) {
      const nextIds = await scheduleNotificationForMedicine(medicine, nextCycleStart, cyclesRemaining - 1);
      notificationIds.push(...nextIds);
    }

    return notificationIds;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return notificationIds;
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


