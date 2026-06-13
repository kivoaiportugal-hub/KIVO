# Kivo UI/UX Guidelines

This document defines the visual and interaction system for Kivo: a premium restaurant operations platform with an Apple-like feel, soft glass surfaces, and a controlled green identity.

## Product Feel

- Calm, premium, precise, and operational.
- Clean enough to feel trusted, dense enough to feel powerful.
- Polished like a high-end product, not decorative like a marketing site.
- The green palette is the brand signature. Use it with restraint.

## Core Principles

1. Clarity first. Every screen should answer what is happening, what matters, and what to do next.
2. Depth without clutter. Use layering, blur, and subtle shadows instead of heavy borders or loud fills.
3. Green is signal, not wallpaper. Reserve it for active states, highlights, positive metrics, and agent presence.
4. Glass is a material, not an effect. Keep it subtle and consistent.
5. Typography does the heavy lifting. Use size, weight, and spacing to create hierarchy.
6. Avoid noisy decoration. No bokeh, no floating orbs, no random gradients.

## Typography

- Primary font: `Iosevka Charon`
- Use monospace character and rhythm intentionally as a brand cue.
- Keep letter spacing at `0`.
- Do not scale font size with viewport width.
- Use weight and size changes to create hierarchy, not extra styling.

### Type Roles

- `Display`: large hero labels, key numbers, and page headlines.
- `Title`: section headings and panel headers.
- `Body`: regular interface copy.
- `Mono`: technical values, IDs, timestamps, status chips, and logs.

### Type Guidance

- Headlines should be short and direct.
- Body copy should be concise and operational.
- Numbers and KPIs should be visually prominent.
- Avoid decorative all-caps unless used for compact labels.

## Color System

### Base Neutrals

- `Background / Base`: `#F5F7F6`
- `Surface / Panel`: `rgba(255, 255, 255, 0.62)`
- `Surface Strong`: `rgba(255, 255, 255, 0.78)`
- `Border / Hairline`: `rgba(20, 28, 24, 0.08)`
- `Text Primary`: `#101814`
- `Text Secondary`: `#5E6863`
- `Text Muted`: `#8A9490`

### Brand Greens

- `Green 950`: `#05140B`
- `Green 900`: `#0A2415`
- `Green 800`: `#0F3B24`
- `Green 700`: `#165C37`
- `Green 600`: `#1F8A4D`
- `Green 500`: `#27B15F`
- `Green 400`: `#55D47F`
- `Green 300`: `#8BE8A7`

### Accent Colors

- `Teal`: `#4CCFC0`
- `Blue`: `#6EA8FF`
- `Amber`: `#F2B84B`
- `Red`: `#F56C6C`

### Usage Rules

- Use green for active states, confirmations, success metrics, live agent cues, and key highlights.
- Use teal and blue sparingly for secondary data visualization.
- Use amber for warnings and attention states.
- Use red only for critical issues, errors, or losses.
- Never let the UI become green-heavy across every component.

## Gradients

Use gradients as atmosphere, not decoration.

### Approved Gradient Directions

- Green to teal for active surfaces and assistant energy.
- Green to transparent for subtle glows.
- Neutral white to soft green for hero backdrops.

### Gradient Rules

- Keep gradients soft and low contrast.
- Avoid rainbow effects and strong multicolor transitions.
- Gradients should support depth, not compete with content.

## Glassmorphism

- Use translucent surfaces with blur.
- Keep blur subtle and believable.
- Add a faint border and soft shadow to separate layers.
- Prefer rounded rectangles with calm geometry.
- Do not over-stack glass layers.

### Recommended Surface Recipe

- Background blur: medium
- Fill: semi-transparent white or near-white
- Border: 1px hairline with low-opacity contrast
- Shadow: soft, diffused, low opacity

## Shape and Radius

- Main cards: 20px radius
- Compact controls: 12px radius
- Chips and pills: 999px radius
- Panels: gently rounded, never sharp-heavy
- Avoid very large ornamental rounding on everything

## Layout Rules

- Use strong vertical rhythm and clear spacing blocks.
- Prefer full-width bands and logical sections over floating card piles.
- Keep the main content area visually grounded.
- Side panels should feel supportive, not dominant.
- The first viewport must show meaningful product state, not an empty hero.

## Components

### Buttons

- Primary button: green fill or green-to-teal gradient.
- Secondary button: glass surface with subtle border.
- Tertiary button: text or icon-only, minimal framing.
- Use icons inside buttons where appropriate.

### Cards

- Cards should carry information, status, or action.
- Each card needs a clear purpose.
- Keep cards compact and content-rich.
- Avoid nested cards inside cards.

### Chips and Status

- Use chips for states like live, synced, warning, paused, or pending.
- Keep chips small, readable, and stable in width.
- Use color only when it adds meaning.

### Tables and Lists

- Dense but readable.
- Use subtle separators instead of loud grid lines.
- Highlight the active row with a soft tinted surface.

### Charts

- Prefer thin lines, restrained fills, and minimal grid noise.
- Use green as the lead color for positive or current data.
- Reserve accent colors for comparisons, warnings, or categories.

## Motion

- Motion should feel intentional and quiet.
- Use short, elegant transitions.
- Prefer easing that feels responsive and smooth.
- Avoid dramatic bounce or playful UI motion.
- Never animate routine repetitive actions heavily.

### Motion Defaults

- Hover: subtle lift or glow
- Active press: quick scale down or shadow compression
- Panel entrance: soft fade and rise
- Data updates: gentle transition, no flashy interruption

## Icons and Visual Language

- Use simple, familiar icons.
- Prefer outline icons with consistent stroke weight.
- Keep iconography neutral and clear.
- Do not mix icon styles across the product.

## Empty States

- Empty states should feel calm and useful, not apologetic.
- Explain the next useful action.
- Keep illustration usage minimal and aligned to the brand.

## Data Density

- The product is operational, so density matters.
- Show enough information to reduce context switching.
- Use whitespace to organize, not to hide.
- Make the dashboard feel efficient on first glance.

## Platform Tone

- Premium.
- Trustworthy.
- Quietly intelligent.
- Slightly futuristic, but grounded in real operations.

## What To Avoid

- Pure white flat screens with no depth.
- Heavy purple bias.
- Oversized decorative gradients.
- Loud neon surfaces.
- Cartoonish motion.
- Generic SaaS card wallpaper.
- Random blobs, orbs, and bokeh.
- Overuse of glass effects on every layer.

## Suggested Visual Identity

- Base: soft neutral background
- Brand: controlled green
- Support: teal, blue, amber, red
- Material: glass, blur, fine borders
- Tone: calm premium operations

## Figma Usage Notes

- Build reusable tokens for color, spacing, radius, blur, and shadow.
- Keep text styles tightly named by role.
- Create components for cards, chips, buttons, charts, and top bars.
- Define a single source of truth for surface styles.

## Summary

Kivo should feel like a premium operational system with a controlled green signature, subtle glass depth, and a calm Apple-like discipline. The interface should look expensive, clear, and useful before it looks expressive.
