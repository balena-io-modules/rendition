# Migrating from v6.x to v7.x

Version 7 of Rendition includes several breaking changes mostly due to upgrade in styled
components and styled system. Note that you might also need to migrate to styled-components v4, so make sure
to check their migration guide as well. This document aims to list these changes and provide a migration path for users wanting to upgrade.

## Removed

- All components have to be wrapped in the `Provider` component in order to
have the rendition theme passed to them. Originally, all components wrapped in
`asRendition` HOC would have a default theme set if they were not wrapped in a `Provider`

## Renamed

- `w` prop has been replaced by `width`.
- `f` prop has been replaced by `fontSize`
- `wrap` prop has been replaced by `flexWrap`
- `align` prop has been replaced by `alignItems` (Note: `Txt` component's `align` refers to `textAlign`, so that is something you should be careful about).
- `justify` prop has been replaced by `justifyContent`
- `direction` prop has been replaced by `flexDirection`

## Changed

- The `flexWrap` (previously `wrap`) value changed from a `boolean`
to a `string` (following CSS definition).

## Typings

- Removed LinkBaseProps, ButtonBaseProps, and FixedBaseProps exports (can be replaced with LinkProps, ButtonProps, FixedProps)
- Removed ThemedBadgeProps, ThemedButtonProps, ThemedInputProps, ThemedModalProps, ThemedProgressBarProps, ThemedProvider, ThemedTerminalProps, ThemedTxtProps as they are not meant to be used directly (but are passed using a Provider).
- Made exported components' typings a bit more accurate, reflecting whether they are wrapped by styled components.