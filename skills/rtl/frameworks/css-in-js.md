# RTL — CSS-in-JS (styled-components / emotion)

---

## Core approach

Two strategies — pick one per project:

**A) CSS logical properties (preferred)**
Write logical properties directly. Works with `dir="rtl"` on parent. No extra tooling.

**B) stylis-plugin-rtl / @emotion/cache with rtl**
Auto-flips physical properties at build time. More legacy-compatible but adds complexity.

Recommendation: **use logical properties** — cleaner, no plugin dependency.

---

## Theme setup with direction

```js
// theme.js
export const theme = {
  direction: 'rtl', // or 'ltr'
  fonts: {
    arabic: "'Cairo', 'Tajawal', sans-serif",
    latin: "'Inter', system-ui, sans-serif",
  },
}

// App.jsx
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div dir={theme.direction}>
        ...
      </div>
    </ThemeProvider>
  )
}
```

---

## RTL-aware styled components

```js
import styled, { css } from 'styled-components'

// Helper: direction-aware styles
const rtl = (styles) => css`
  [dir="rtl"] & { ${styles} }
`
const ltr = (styles) => css`
  [dir="ltr"] & { ${styles} }
`

// Usage
const Sidebar = styled.aside`
  inset-inline-start: 0;
  width: 280px;
  border-inline-end: 1px solid ${({ theme }) => theme.colors.border};
`

const NavItem = styled.li`
  padding-inline: 1rem;
  
  /* Icon inside nav item */
  svg.directional {
    transform: scaleX(var(--rtl-flip, 1));
  }
`
```

---

## Dynamic direction from theme

```js
const FlexRow = styled.div`
  display: flex;
  flex-direction: ${({ theme }) => 
    theme.direction === 'rtl' ? 'row-reverse' : 'row'
  };
  gap: 1rem;
`

// Or derive from dir attribute with CSS (no re-render needed)
// Note: flex-direction is NOT auto-reversed by dir="rtl" — must be explicit
const Container = styled.div`
  display: flex;
  flex-direction: row;

  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`
```

---

## Global styles

```js
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    --rtl-flip: ${({ theme }) => theme.direction === 'rtl' ? -1 : 1};
    --font-primary: ${({ theme }) => theme.fonts.arabic};
    --line-height-arabic: 1.7;
  }

  * {
    box-sizing: border-box;
    letter-spacing: 0; /* Critical for Arabic */
  }

  body {
    font-family: var(--font-primary);
    line-height: var(--line-height-arabic);
    direction: ${({ theme }) => theme.direction};
  }

  /* LTR island utility */
  .ltr-island {
    direction: ltr;
    display: inline-block;
    unicode-bidi: embed;
  }
`
```

---

## Icon component pattern

```jsx
import styled from 'styled-components'

const DirectionalIcon = styled.span`
  display: inline-flex;
  transform: scaleX(var(--rtl-flip, 1));
  transition: transform 0.2s;
`

// Usage
<DirectionalIcon><ChevronRight size={16} /></DirectionalIcon>

// Non-directional — no wrapper needed
<Heart size={16} />
```

---

## Emotion example

```js
import { css } from '@emotion/react'

const cardStyle = css`
  padding-inline: 1.5rem;
  padding-block: 1rem;
  border-inline-start: 3px solid var(--color-primary);
  text-align: start;
`

// With theme
const inputStyle = (theme) => css`
  font-family: ${theme.fonts.arabic};
  letter-spacing: 0;
  line-height: 1.7;
  text-align: start;
  padding-inline: 0.75rem;
  padding-block: 0.5rem;
`
```
