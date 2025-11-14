# Pill Reminder App

A React Native app built with Expo SDK 54 that helps you remember to take your medications with customizable reminders, snooze functionality, and daily resets.

## Features

- ✨ **Modern UI with Tailwind CSS (NativeWind)** - Beautiful and responsive design
- 💊 **Add multiple medicines** with custom reminder times
- 🔄 **Repeating reminders** with configurable intervals
- ⏰ **Snooze functionality** - Postpone reminders individually or all at once
- ✅ **Take/Won't Take** - Mark medicines as taken or intentionally skipped
- 🗑️ **Remove medicines** - Delete medicines with trash icon
- 🎯 **Bulk actions** - "Take All" and "Snooze All" buttons for pending medicines
- 📅 **Daily automatic reset** of taken status at midnight
- 💾 **Local storage** using AsyncStorage - No internet required
- 🔔 **Push notifications** with Expo Notifications
- 🎨 **Clean and modern UI** with intuitive navigation

## Requirements

- Node.js >= 20.19.4 (recommended for Expo SDK 54)
- npm or yarn
- Expo Go app on your mobile device (for testing)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - For iOS: Press `i` or scan the QR code with the Expo Go app
   - For Android: Press `a` or scan the QR code with the Expo Go app

## Usage

### Adding a Medicine

1. Tap the "+" button on the home screen
2. Fill in the medicine details:
   - **Name**: Name of the medicine (e.g., "Aspirin")
   - **Time**: Time to take the medicine in HH:mm format (e.g., "09:00")
   - **Repeat Interval**: Minutes between repeat reminders (e.g., "15")
   - **Max Repeats**: Maximum number of repeat reminders (e.g., "3")
   - **Snooze Time**: Minutes to snooze when snoozed (e.g., "5")
3. Tap "Save Medicine"

### Managing Medicines

#### Individual Actions
- **Take**: Marks the medicine as taken and cancels pending notifications
- **Snooze**: Postpones the reminder for the configured snooze time
- **Won't Take**: Marks the medicine as skipped (treated as taken but with different intent)
- **Remove**: Delete a medicine from your list (trash icon under status badge)

#### Bulk Actions (Top Bar)
- **Snooze All**: Postpone all pending medicine reminders at once
- **Take All**: Mark all pending medicines as taken simultaneously

Note: Bulk action buttons only appear when you have pending medicines.

### Daily Reset

The app automatically resets all "taken" statuses at midnight each day and reschedules notifications.

## Testing

### Test Notifications

1. Add a medicine with a time close to the current time (e.g., 2 minutes from now)
2. Close the app or put it in the background
3. Wait for the notification to appear
4. Test the "Take" and "Snooze" buttons

### Test Repeat Reminders

1. Add a medicine with:
   - Time: 2 minutes from now
   - Repeat Interval: 1 minute
   - Max Repeats: 2
2. Observe that you receive 3 notifications total (initial + 2 repeats)

### Test Daily Reset

1. Add a medicine and mark it as "Taken"
2. Change your device date to the next day
3. Reopen the app
4. Verify the medicine status is reset to "Pending"

## Project Structure

```
pill-reminder/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── AddMedicineScreen.tsx
│   ├── storage/
│   │   └── index.ts
│   ├── notifications/
│   │   └── index.ts
│   ├── utils/
│   │   ├── reminderActions.ts
│   │   └── dailyReset.ts
│   └── types.ts
├── App.tsx
├── app.json
└── package.json
```

## Technologies Used

- React 19.1.0
- React Native 0.81.5
- Expo SDK 54
- TypeScript 5.9
- **NativeWind (Tailwind CSS for React Native)** 🎨
- Expo Notifications
- AsyncStorage
- React Navigation
- Expo Vector Icons
- React Native Reanimated
- date-fns

## Permissions

The app requires notification permissions to function properly. You will be prompted to grant these permissions when you first launch the app.

### Android
- `android.permission.SCHEDULE_EXACT_ALARM`
- `android.permission.POST_NOTIFICATIONS`

### iOS
- Notification permissions are requested at runtime

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## Notes

- Notifications work best on physical devices
- For iOS, notifications may not appear when the app is in the foreground
- The app stores all data locally using AsyncStorage
- No internet connection required


