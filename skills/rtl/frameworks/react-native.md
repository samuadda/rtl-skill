# RTL — React Native

---

## Version Assumptions

- **Minimum: React Native 0.65.** First version with native `marginStart`/`marginEnd`/`paddingStart`/`paddingEnd`/`start`/`end` style props that respect `I18nManager.isRTL` automatically. Below 0.65 these props don't exist — you must compute every directional value through the `rtlValue()` helper.
- **Recommended: RN 0.71+.** Stable Yoga 1.19 layout, fewer RTL edge cases around nested ScrollViews.
- **Known gotchas across versions:**
  - `I18nManager.forceRTL(true)` requires a full app reload to take effect — `RNRestart.Restart()` or kill-and-relaunch. This is true on every version.
  - On RN 0.71+, `transform` arrays do not auto-flip; sign your `translateX` against `I18nManager.isRTL` manually.
  - `FlatList` `inverted` prop combined with `I18nManager.isRTL` double-flips the scroll direction. Pick one.
  - Hermes engine (default on RN 0.70+) handles Arabic strings correctly, but `String.prototype.charAt` still cuts code units, not graphemes — use `Intl.Segmenter` (available on Hermes 0.12+, ships with RN 0.74+).
- **Older than 0.65?** See the "Legacy: pre-0.65 fallback" section at the bottom.

If you can't determine the project's RN version (no `package.json` in scope), default to the latest stable (RN 0.74) and flag the assumption to the user before generating.

---

## Core setup

```js
// index.js or App.js — MUST be set before any rendering
import { I18nManager } from 'react-native'

// Force RTL for Arabic
I18nManager.forceRTL(true)
I18nManager.allowRTL(true)
```

**Important:** After calling `forceRTL`, the app needs to reload to apply. In production, trigger a reload after locale change:
```js
import RNRestart from 'react-native-restart'
RNRestart.Restart()
```

---

## Layout differences from web

React Native uses **Yoga layout** (Flexbox subset). Key differences:

- `flexDirection` defaults to `column` (not `row`)
- No CSS logical properties — use `I18nManager.isRTL` for conditionals
- `StyleSheet` physical properties (`left`, `right`) do NOT auto-flip
- Must handle mirroring manually

---

## Style helpers

```js
import { I18nManager, StyleSheet } from 'react-native'

const isRTL = I18nManager.isRTL

// RTL-aware value helper
export const rtlValue = (ltrValue, rtlValue) => 
  isRTL ? rtlValue : ltrValue

// RTL-aware style helper  
export const rtlStyle = (ltrStyles, rtlStyles) =>
  isRTL ? rtlStyles : ltrStyles

// Usage
const styles = StyleSheet.create({
  container: {
    flexDirection: rtlValue('row', 'row-reverse'),
    paddingLeft: rtlValue(16, 0),
    paddingRight: rtlValue(0, 16),
  }
})
```

---

## Text

```jsx
import { Text, StyleSheet } from 'react-native'

// Always set writingDirection and textAlign for Arabic text
const ArabicText = ({ children, style }) => (
  <Text style={[styles.arabic, style]}>
    {children}
  </Text>
)

const styles = StyleSheet.create({
  arabic: {
    fontFamily: 'Cairo-Regular', // must be loaded via expo-font or react-native-fonts
    writingDirection: 'rtl',
    textAlign: 'right', // RN doesn't support 'start'/'end' — use isRTL conditional
    lineHeight: 28, // generous for Arabic diacritics
    letterSpacing: 0, // critical — never set positive letter spacing on Arabic
  }
})
```

---

## Fonts in React Native

```js
// expo-font setup
import { useFonts } from 'expo-font'

export default function App() {
  const [fontsLoaded] = useFonts({
    'Cairo-Regular': require('./assets/fonts/Cairo-Regular.ttf'),
    'Cairo-Medium': require('./assets/fonts/Cairo-Medium.ttf'),
    'Cairo-Bold': require('./assets/fonts/Cairo-Bold.ttf'),
    'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
  })

  if (!fontsLoaded) return null
  return <NavigationContainer>...</NavigationContainer>
}
```

---

## Icons

```jsx
import { isRTL } from './rtl-helpers'

// Flip directional icons
const DirectionalIcon = ({ children }) => (
  <View style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}>
    {children}
  </View>
)

// Usage
<DirectionalIcon><ChevronRightIcon /></DirectionalIcon>

// Neutral icons — no wrapper
<HeartIcon />
```

---

## Navigation (React Navigation)

```js
// Stack navigator — back gesture direction flips automatically with I18nManager
// BUT: header back button icon may need manual flip

// Custom back button
const RTLBackButton = () => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <ChevronIcon 
      style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }} 
    />
  </TouchableOpacity>
)
```

---

## Animations (Animated API)

```js
import { Animated, I18nManager } from 'react-native'

const slideAnim = useRef(new Animated.Value(0)).current
const direction = I18nManager.isRTL ? 1 : -1

// Slide in from inline-start
Animated.timing(slideAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start()

const slideStyle = {
  transform: [{
    translateX: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [300 * direction, 0], // direction flips sign
    })
  }]
}
```

---

## Common mistakes in React Native RTL

1. **Setting `I18nManager.forceRTL` too late** — must be before first render
2. **Using `marginLeft`/`marginRight` directly** — use `rtlValue()` helper or `marginStart`/`marginEnd` (RN 0.65+)
3. **Forgetting reload after `forceRTL`** — styles don't update without restart
4. **Positive `letterSpacing` on Arabic text** — always 0
5. **Not flipping scroll indicators** in horizontal ScrollViews

---

## Legacy: pre-0.65 fallback

On RN < 0.65, `marginStart` / `marginEnd` / `paddingStart` / `paddingEnd` / `start` / `end` do not exist. Every directional value must go through the `rtlValue()` helper.

```js
import { I18nManager, StyleSheet } from 'react-native'

const isRTL = I18nManager.isRTL
export const rtlValue = (ltr, rtl) => (isRTL ? rtl : ltr)

const styles = StyleSheet.create({
  card: {
    // No marginStart on this version — fall back to physical props + helper
    marginLeft: rtlValue(16, 0),
    marginRight: rtlValue(0, 16),
    paddingLeft: rtlValue(12, 0),
    paddingRight: rtlValue(0, 12),
    borderLeftWidth: rtlValue(2, 0),
    borderRightWidth: rtlValue(0, 2),
  },
})
```

Upgrade to 0.65+ when feasible — the helper-everywhere pattern is verbose and easy to forget on new components.
