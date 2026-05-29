---
name: TaskPilot Cyber-Clay
colors:
  surface: '#111213'
  surface-dim: '#0f1011'
  surface-bright: '#242629'
  surface-container-lowest: '#0a0a0b'
  surface-container-low: '#141517'
  surface-container: '#18191b'
  surface-container-high: '#1d1f21'
  surface-container-highest: '#242629'
  on-surface: '#e2e2e4'
  on-surface-variant: '#c4c6ca'
  inverse-surface: '#e2e2e4'
  inverse-on-surface: '#2e3034'
  outline: '#8b8e94'
  outline-variant: '#45474a'
  surface-tint: '#ff5500'
  primary: '#ff5500'
  on-primary: '#1a0800'
  primary-container: '#ff6600'
  on-primary-container: '#331100'
  inverse-primary: '#cc4400'
  secondary: '#a3a6ad'
  on-secondary: '#1c1d20'
  secondary-container: '#383a3f'
  on-secondary-container: '#e8e8ea'
  tertiary: '#94979e'
  on-tertiary: '#18191b'
  tertiary-container: '#2a2b2f'
  on-tertiary-container: '#d0d1d4'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ff884d'
  primary-fixed-dim: '#ff5500'
  on-primary-fixed: '#1a0800'
  on-primary-fixed-variant: '#4d1900'
  secondary-fixed: '#d1d3d6'
  secondary-fixed-dim: '#a3a6ad'
  on-secondary-fixed: '#1c1d20'
  on-secondary-fixed-variant: '#383a3f'
  tertiary-fixed: '#e8e9ea'
  tertiary-fixed-dim: '#94979e'
  on-tertiary-fixed: '#18191b'
  on-tertiary-fixed-variant: '#2a2b2f'
  background: '#111213'
  on-background: '#e2e2e4'
  surface-variant: '#242629'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 1.2
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 1.6
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 1.0
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 3rem
  container-padding-mobile: 1.5rem
  gutter: 2rem
---

## Brand & Style
The aesthetic merges **Dark Neon Cyberpunk**, **Glassmorphism**, and **Claymorphism**. The mood is futuristic and deeply interactive. Elements appear to hover above the dark #111213 void. We rely on dramatic curves and soft internal shading to give a clay-like 3D squishiness to the buttons and cards, paired with heavily blurred frosted glass layers that cast subtle neon orange glows.

## Colors
- **Void:** `#111213`
- **Neon Orange (Primary):** `#FF5500` - Used for glowing accents, primary actions, and neon text highlights.
- **Glass Surfaces:** Dark gray `#18191b` at 60-80% opacity, allowing the void to bleed through.

## Elevation & Depth
Depth is critical. 
1. **Backdrop:** Pure void `#111213`.
2. **Glassmorphism (Level 1):** Cards are glass surfaces with `backdrop-filter: blur(25px)` and a 1px border gradient (white 20% to transparent). They should cast a very subtle, faint neon orange drop shadow `0 8px 32px rgba(255, 85, 0, 0.05)`.
3. **Claymorphism (Level 2):** Buttons use a solid but translucent gradient, and feature dual inner-shadows (white on top-left, deep orange on bottom-right) to appear "squishy" and 3D extruded. Hover states intensify the outer neon glow.

## Shapes
We lean heavily into **organic curves**. The base rounding is 1rem (16px), but major layout containers (like the Sidebar or Dashboard widgets) should use extreme rounding (2rem/32px or 3rem/48px), creating fluid, pill-like shapes across the interface.

## Animations
Subtle hover animations are required. Interactive glassmorphic elements should gently elevate (translateY(-2px)) and increase their blur/glow radius.
