# Changelog

## [2.0.0] - 2025-11-09

### Major Updates

#### 🎨 Styling Overhaul
- **Migrated to Tailwind CSS (NativeWind)** - Complete UI redesign with modern, responsive styling
- Removed all StyleSheet-based styling in favor of Tailwind utility classes
- Added `global.css` for Tailwind imports
- Configured `tailwind.config.js` and `metro.config.js` for NativeWind integration
- Added `nativewind-env.d.ts` for TypeScript support

#### ✨ New Features

##### Home Screen Enhancements
1. **Remove Button** - Trash icon under each medicine's status badge for easy deletion
2. **Won't Take Button** - New action button to mark medicine as intentionally skipped
3. **Bulk Actions Bar** - New top bar with:
   - **Snooze All** - Postpone all pending medicines at once
   - **Take All** - Mark all pending medicines as taken simultaneously
   - Bar only appears when there are pending medicines
4. **Improved Button Layout** - Three-button layout: Won't Take | Snooze | Take

##### Add Medicine Screen
- **Auto-navigation** - Automatically returns to home screen after successfully adding medicine
- Alert dialog now includes navigation callback

##### UI/UX Improvements
- Modern card-based design with rounded corners
- Color-coded action buttons (Red: Won't Take, Blue: Snooze, Green: Take)
- Improved spacing and padding throughout
- Better visual hierarchy with consistent typography
- Shadow effects for depth and modern feel
- Responsive layouts using Tailwind utilities

#### 🔧 Technical Changes

##### Dependencies Added
- `nativewind@^4.2.1` - Tailwind CSS for React Native
- `tailwindcss@^4.1.17` - Core Tailwind CSS
- `react-native-reanimated@^4.1.3` - Required for NativeWind
- `@expo/vector-icons@^15.0.3` - Icon library for trash and other icons

##### Configuration Files
- `tailwind.config.js` - Tailwind configuration with NativeWind preset
- `metro.config.js` - Metro bundler config with NativeWind v4 babel transformer
- `global.css` - Tailwind directives
- `nativewind-env.d.ts` - TypeScript definitions
- Updated `babel.config.js` with NativeWind and Reanimated plugins

##### Code Structure
- Added `import './global.css'` to all screen components and App.tsx
- Refactored all components to use `className` prop instead of `style`
- Maintained all existing functionality while improving UI

#### 📦 SDK Updates
- **Expo SDK 54** - Latest stable version
- **React 19.1.0** - Latest React version
- **React Native 0.81.5** - Latest RN version
- **TypeScript 5.9.2** - Latest TypeScript

### Breaking Changes
- Removed all `StyleSheet.create()` usage
- Changed from inline styles to Tailwind classes
- Requires Node.js >= 20.19.4 for optimal performance

### Migration Notes
If you're upgrading from v1.x:
1. Clear Expo cache: `npx expo start --clear`
2. Reinstall dependencies: `npm install`
3. Ensure Node.js >= 20.19.4 is installed

### Bug Fixes
- Fixed navigation flow when adding medicines
- Improved error handling for remove operations
- Better confirmation dialogs for destructive actions
- Fixed metro.config.js for NativeWind v4 compatibility

---

## [1.0.0] - Initial Release
- Basic medicine reminder functionality
- Add/edit medicines
- Notification scheduling
- Daily reset functionality
- Take/Snooze actions
- Local storage with AsyncStorage

