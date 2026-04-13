# RTL — React Native

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
import { Transform } from 'react-native' // not available — use style
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
