# RTL — CSS-in-JS (styled-components / emotion)

---

## Version Assumptions

- **styled-components: v5.0+** for full template-literal interpolation and theme typing. v6 (current) is fully compatible with logical properties and is the recommended floor.
- **@emotion/react / @emotion/styled: v11+.** v10 is end-of-life; APIs differ enough that examples here will not compile on v10.
- **Browser baseline:** same as plain CSS — Safari 14.1+, Chrome 87+, Firefox 66+ for logical properties. CSS-in-JS does not change browser support; it only changes where the styles live.
- **`stylis-plugin-rtl` (legacy, avoid for new work):** This plugin auto-flips physical properties at build time by transforming the CSS AST. It was the standard pre-2021 when logical properties had spotty support. Today it adds a build-time dependency, conflicts with logical properties (double-flips), and has known bugs around shorthand `padding`/`margin`. **Recommendation:** delete it from new projects. Use logical properties directly. Mention it only when migrating an existing codebase that already depends on it.
- **Known gotchas:**
  - styled-components v6 changed how dynamic props are passed — `$transient` props (`$direction`) are now required to avoid DOM warnings. Old code using `direction` as a regular prop will leak to the DOM.
  - Emotion's `css` prop requires the JSX pragma or `@emotion/babel-preset-css-prop` — easy to forget when copy-pasting examples.

If you can't determine the version (no `package.json` resolves), default to styled-components v6 / Emotion v11 and flag the assumption to the user.

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
