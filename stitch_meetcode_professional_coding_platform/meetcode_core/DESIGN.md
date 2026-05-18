---
name: MeetCode Core
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '450'
    lineHeight: '1.7'
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  column-gap: 24px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for high-performance developer environments, prioritizing focus, speed, and visual clarity. It adopts a **Minimalist-Corporate** aesthetic with a heavy emphasis on technical precision, drawing inspiration from modern engineering tools.

The interface is built on a "Dark First" philosophy, utilizing deep neutral tones to reduce eye strain during long coding sessions. The emotional response is one of professional competence and flow-state enablement. Visual interest is achieved through high-contrast typography and razor-sharp accent hits rather than decorative flourishes.

## Colors
The palette is rooted in the "Zinc" spectrum, providing a neutral, sophisticated foundation that allows code syntax and status indicators to pop. 

- **Primary Background**: The absolute base layer uses `#09090b` to create infinite depth.
- **Surface Tiers**: Elevated components (cards, sidebars, modals) use `#18181b`.
- **Accents**: Emerald Green is the signature action color. Electric Blue is reserved for informational states and interactive links.
- **Status Hierarchy**: Difficulty levels and system alerts follow a strict semantic mapping: Emerald (Success/Easy), Amber (Warning/Medium), and Rose (Error/Hard).

## Typography
The typography system balances modern UI elegance with technical utility. **Geist** serves as the primary typeface, offering a clean, geometric structure that maintains legibility at small sizes. 

**JetBrains Mono** is utilized for all code-related content and metadata labels (like difficulty tags or file paths) to reinforce the developer-centric nature of the platform. Use `headline-xl` sparingly for marketing hero sections, and `code-block` for all IDE-lite components. `label-xs` should always be set in Uppercase for metadata.

## Layout & Spacing
This design system employs a **12-column fluid grid** for dashboard views and a **fixed-center layout** for content-heavy pages like problem descriptions.

- **Grid System**: Use 24px gutters to allow complex UI panels (Code Editor, Terminal, Chat) to feel distinct yet connected.
- **Rhythm**: All spacing follows an 8px baseline. Use 8px/16px for internal component padding and 24px/32px/48px for section margins.
- **Adaptability**: On mobile, the 12-column grid collapses to a single column with 16px side margins. Horizontal sidebars should transform into bottom-anchored sheets or drawer menus.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional drop shadows. 

1. **Level 0 (Base)**: `#09090b` – The canvas background.
2. **Level 1 (Containers)**: `#18181b` – Used for cards, editor panes, and sidebars.
3. **Level 2 (Popovers)**: `#18181b` with a 1px border of `#27272a` and a very subtle 15% black shadow to provide separation from Level 1.

Separation between adjacent panels (e.g., the File Explorer vs. the Code Editor) is achieved solely via 1px borders using the `border-subtle` token. This maintains a flat, "IDE-like" appearance that maximizes screen real estate.

## Shapes
The shape language is "Soft-Technical." Elements use a base roundedness of **0.5rem (8px)** for standard components like buttons and inputs. Larger containers and cards utilize **1rem (16px)** to create a distinct, modern container feel (the "rounded-xl" aesthetic).

Interactive elements like Checkboxes and Radio buttons should remain slightly sharper (4px) to signal precision, while "Difficulty Chips" should be fully pill-shaped to differentiate them from actionable buttons.

## Components
- **Buttons**: Primary buttons use a solid Emerald Green background with dark text. Secondary buttons use a ghost style (transparent with a `#27272a` border) that shifts to a subtle gray hover state.
- **Difficulty Chips**: Small, pill-shaped tags. "Easy" uses Emerald text with a 10% opacity Emerald fill. "Medium" uses Amber. "Hard" uses Rose.
- **Input Fields**: Dark backgrounds (`#09090b`) with a 1px border. The border glows Electric Blue on focus with a minimal 2px outer spread.
- **Code Editor**: Must use a customized theme matching the palette. Background must be `#18181b`. Active line highlighting should use a subtle `#27272a` background.
- **Progress Bars**: Thin (4px) tracks using `#27272a` as the background and Emerald Green as the fill.
- **Lists**: Problem lists use a "Stripe" or "Hover" row style. On hover, the background of the row shifts to `#27272a` with no border change.