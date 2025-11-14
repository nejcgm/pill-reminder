# Features Guide

## 🎨 New UI with Tailwind CSS

The app now uses **NativeWind** (Tailwind CSS for React Native) for a modern, clean, and responsive design.

### Benefits
- Faster development with utility classes
- Consistent design system
- Better maintainability
- Modern, professional appearance

---

## 🏠 Home Screen Features

### Medicine Cards
Each medicine is displayed in a beautiful card with:
- **Medicine name** (bold, prominent)
- **Status badge** (Green: Taken, Orange: Pending)
- **Time** and schedule details
- **Trash icon** (tap to remove medicine)
- **Action buttons** (only shown for pending medicines)

### Action Buttons (Per Medicine)

#### Won't Take (Red Button)
- Use when you intentionally skip a medicine
- Marks medicine as taken to stop reminders
- Useful for optional medications or when you decide not to take it

#### Snooze (Blue Button)
- Postpone the reminder by the configured snooze time
- Medicine remains pending
- Great for when you need more time

#### Take (Green Button)
- Mark medicine as taken
- Cancels all pending notifications
- Status changes to "Taken"

### Bulk Actions Bar

Located at the top of the screen (only visible when you have pending medicines):

#### Snooze All
- Postpones ALL pending medicine reminders
- Applies each medicine's individual snooze time
- Confirmation dialog before action

#### Take All
- Marks ALL pending medicines as taken
- Cancels all notifications
- Confirmation dialog with count

---

## ➕ Add Medicine Screen

### Modern Form Design
- Clean, spacious input fields
- Clear labels and helpful placeholders
- Consistent styling with Tailwind

### Auto-Navigation
- **New!** Automatically returns to home screen after adding medicine
- Success message with confirmation
- Smooth transition back to medicine list

### Fields
1. **Medicine Name** - Required
2. **Time (HH:mm)** - Required, 24-hour format
3. **Repeat Interval** - Optional, in minutes
4. **Max Repeats** - Optional, number of repetitions
5. **Snooze Time** - Optional, defaults to 5 minutes

---

## 🗑️ Remove Medicine

### How to Remove
1. Find the medicine card you want to remove
2. Look for the **trash icon** below the status badge (right side)
3. Tap the trash icon
4. Confirm deletion in the alert dialog

### What Happens
- Medicine is permanently deleted from your list
- All scheduled notifications are cancelled
- Action cannot be undone

---

## 💡 Tips & Best Practices

### Organizing Your Medicines
- Add all medicines in the morning to see them together
- Use descriptive names (e.g., "Morning Vitamin D" instead of just "Vitamin")
- Set realistic snooze times (5-10 minutes works well)

### Using Bulk Actions
- **Morning routine**: Use "Take All" after taking all morning medicines
- **Running late**: Use "Snooze All" to postpone everything by their snooze time
- **Evening**: Check for any pending medicines before bed

### Won't Take vs Take
- **Take**: You actually took the medicine
- **Won't Take**: You decided not to take it (skipped intentionally)
- Both stop notifications, use appropriate one for tracking purposes

### Repeat Intervals
- Set for medicines that need multiple reminders
- Example: Important medicine at 9 AM, repeat every 15 min, max 3 repeats
- You'll get reminders at 9:00, 9:15, 9:30, 9:45

---

## 🎯 Common Workflows

### Adding Your First Medicine
1. Tap the **blue + button** (bottom right)
2. Fill in medicine details
3. Tap **Save Medicine**
4. Automatically returns to home screen
5. Medicine appears in your list

### Morning Routine
1. Wake up and see all pending medicines
2. Take your medicines
3. Tap **Take All** button at the top
4. Confirm in dialog
5. All medicines marked as taken ✓

### Forgot to Take One?
1. See notification
2. Open app
3. If you can't take it now: Tap **Snooze**
4. If you're skipping it: Tap **Won't Take**
5. If you just took it: Tap **Take**

### Cleaning Up
1. Find medicine you no longer need
2. Tap **trash icon** under status
3. Confirm removal
4. Medicine is deleted

---

## 🔔 Notification Behavior

### When You Get Notifications
- At the scheduled time
- After repeat intervals (if configured)
- After snooze time (if you snoozed)

### When Notifications Stop
- When you tap **Take** or **Won't Take**
- When you **remove** the medicine
- After the maximum number of repeats

### Daily Reset
- Every midnight, all "Taken" statuses reset to "Pending"
- Notifications are rescheduled for the next day
- Automatic, no action needed

---

## 🎨 Color Guide

### Status Badges
- 🟢 **Green**: Taken
- 🟠 **Orange**: Pending

### Action Buttons
- 🔴 **Red**: Won't Take (skip/refuse)
- 🔵 **Blue**: Snooze (postpone)
- 🟢 **Green**: Take (confirm taken)

### Bulk Actions
- 🔵 **Blue**: Snooze All
- 🟢 **Green**: Take All

---

## ⚡ Keyboard Shortcuts & Tips

- Use numeric keyboard for time input (automatically shown)
- Time format must be HH:mm (e.g., 09:30, 14:45)
- All fields except name and time are optional
- Default snooze time is 5 minutes if not specified

---

## 🆘 Troubleshooting

### Notifications Not Appearing?
1. Check app permissions in device settings
2. Ensure app is not in battery saver mode
3. Try removing and re-adding the medicine

### Can't Remove Medicine?
- Make sure you're tapping the trash icon, not the status badge
- Check if you confirmed the deletion dialog

### Bulk Actions Not Showing?
- Bulk action bar only appears when you have pending medicines
- If all medicines are taken, the bar is hidden

### Styling Looks Wrong?
- Clear cache: `npx expo start --clear`
- Reinstall node modules: `npm install`
- Restart the development server

