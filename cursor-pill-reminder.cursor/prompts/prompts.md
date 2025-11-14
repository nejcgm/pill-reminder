# Pill Reminder App — Cursor AI Story (Step-by-Step Prompts)

i already have the rootfile it is nejcgjurameke@Nejcs-MacBook-Pro-2 pill-reminder % 
add any necessary steps or improve the current steps if needed to create this pill reminder app 
also dont use emojis in the code and use comments only if really necessary

### 🧱 Step 1 — Project Setup
Create a new Expo React Native TypeScript project called `pill-reminder`.  
Install `expo-notifications`, `@react-native-async-storage/async-storage`, and `date-fns`.  
Configure notification permissions in `app.json` with a white icon and enable background notifications.  
Set up TypeScript types and folder structure:
- `src/screens`
- `src/storage`
- `src/notifications`
- `src/utils`

---

### 📲 Step 2 — App Initialization
In `App.tsx`, set up notification permission handling using Expo Notifications.  
The app should request notification permission on launch.  
Show a simple centered text like “Pill Reminder App” for now.  
Use a global `NotificationHandler` that enables alert and sound but no badge.

---

### 💾 Step 3 — Local Storage
Create a file `src/storage/index.ts` that uses AsyncStorage to store and retrieve medicine data locally.  
Define a `Medicine` type with these fields:
- id (string)
- name (string)
- time (string, HH:mm)
- repeatInterval (number, minutes)
- maxRepeats (number)
- snoozeTime (number, minutes)
- taken (boolean)  
Implement helper functions:
- `saveMedicine()`
- `getMedicines()`
- `updateMedicine()`

---

### ⏰ Step 4 — Notification Scheduling
Create a file `src/notifications/index.ts`.  
Add functions to:
- Schedule daily notifications at a specific time.  
- Schedule multiple repeat reminders after the first one (based on user settings).  
- Cancel all scheduled notifications when needed.  
Use `date-fns` to handle time calculation (e.g. `addMinutes`, `setHours`, `setMinutes`).  
Notifications should contain title and body text like “Time to take your medicine!”.

---

### 🧭 Step 5 — Navigation Setup
Add React Navigation to the app using `@react-navigation/native` and `@react-navigation/native-stack`.  
Create two screens:  
- `HomeScreen` → shows all saved medicines  
- `AddMedicineScreen` → form for adding a new medicine  
Set up navigation between them.  
Include a “+” button on HomeScreen to navigate to AddMedicineScreen.

---

### 💊 Step 6 — Add Medicine Screen
In `AddMedicineScreen.tsx`, create a simple form with inputs for:  
- Name  
- Time (HH:mm format)  
- Repeat interval (minutes)  
- Max repeats  
- Snooze time (minutes)  
Add a “Save” button that saves the medicine to local storage and schedules notifications.  
When done, navigate back to the HomeScreen.

---

### 🏠 Step 7 — Home Screen
In `HomeScreen.tsx`, load the list of saved medicines from AsyncStorage.  
Display them in a scrollable list with name, time, and status (Taken / Pending).  
Each item should have two buttons:  
- “Take” → marks as taken and cancels any pending notifications  
- “Snooze” → cancels existing notifications and schedules a new one after the snooze time

---

### 🔔 Step 8 — Snooze and Take Logic
Create a helper file `src/utils/reminderActions.ts`.  
Add two functions:
- `handleTake()` → cancels all notifications and updates the medicine as taken  
- `handleSnooze(minutes)` → cancels all notifications and schedules a new one after X minutes  
Use `expo-notifications` for scheduling and canceling.

---

### 🌙 Step 9 — Daily Reset
Add logic that resets all “taken” statuses every day at midnight.  
Implement a small background check on app start to reset medicines if the date has changed since last launch.  
Store the last reset date in AsyncStorage under a separate key.

---

### 🎨 Step 10 — UI Polish
Add light styling using React Native `StyleSheet` or Tailwind (if installed).  
- Rounded cards for medicines  
- Buttons for Take/Snooze with color differences  
- Simple header text  
Ensure the app is responsive and visually clear.

---

### 🧠 Step 11 — Testing
Simulate adding a medicine with time close to the current time to verify notifications.  
Check repeat reminders, snooze, and daily reset behavior offline.  
Confirm notifications still trigger when the app is closed.

---

### 🏁 Step 12 — Wrap Up
Clean up console logs, ensure AsyncStorage and notification logic are stable.  
Add a basic app icon and name “Pill Reminder” in `app.json`.  
Export a release build for testing on Android and iOS.
