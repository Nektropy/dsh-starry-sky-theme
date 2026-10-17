# dsh-starry-sky-theme

A dark-only starry-sky theme for **DeepSeek Harness** (DSH) Web UI: a deep-space palette, a slowly twinkling starfield, and faint constellation figures behind the interface.

![Starry Sky icon](./icon.svg)

## Features

- **One sky for both appearance settings.** Light and Dark both resolve to the night sky. The Client half pins the appearance preference to `dark`, so picking *Light* in Settings → Appearance is corrected back to *Dark* while the plugin is enabled.
- **Deep-space palette.** Navy-violet surfaces, moonlit text, and a starlight-blue accent applied as an alias-token layer.
- **Constellation figures.** Four faint star-chart polylines with glowing anchor stars, drawn in the same sky as the twinkling stars.
- **Quiet by design.** The sky sits in the frame-wide click-through overlay: no pointer capture, no layout shift, and it honours `prefers-reduced-motion`.
- **Removable.** Disabling the plugin removes the palette layer and the sky in the same HMR pass, and stops pinning the appearance.

## Compatibility

- DeepSeek Harness `>= 0.2.1-rc.2` (Web UI).
- No extra dependencies: the Client half uses only the `react` module the Harness already provides.

## Install

From the **Plugin Market** (once listed): Settings → Plugins → Plugin Market → Themes, choose *Starry Sky*.

Or install the package into a profile directly:

```sh
dsh plugin --profile <profile> add dsh-starry-sky-theme
```

Then reload the page. The plugin activates immediately; no restart is needed for the Client half.

## Use

- Open Settings → Appearance: the plugin keeps the appearance on **Dark**. The Light choice is available in the stock UI but snaps back while the plugin is enabled.
- To choose Light again, disable the plugin in Settings → Plugins (or remove it). The saved preference stays `dark` until you change it.
- To turn the sky off, disable the plugin; the original palette returns immediately.

## How it works

The Client module registers three things:

1. `theme.overrideTokens('<package id>', tokens)` — an alias-token layer with the dark value repeated for both color schemes, composed over the active theme and removed when the plugin is disposed.
2. A `theme/change` listener that calls `theme.setTheme('dark')` whenever the resolved scheme is light, so both appearance settings stay night.
3. `slots.register('shell.overlay', ...)` — a `pointer-events: none` sky layer rendered above every column. Stars are generated deterministically (seeded PRNG), constellation lines are fixed percentage coordinates, and the twinkle is CSS keyframes (disabled under reduced motion).

No DOM outside the component is touched, no other plugin's styles are read, and no session state is modified.

## License

MIT © 2026 Nektropy

## 中文简介

DeepSeek Harness 的深色星空主题：深空底色、缓慢闪烁的星点，以及四组淡淡的星座连线。浅色与深色外观都被统一为深色——插件启用时会把外观固定在深色，选择「浅色」会被自动改回。关闭插件即移除配色层与星空，并停止固定外观。支持 DSH `>= 0.2.1-rc.2` 的 Web 界面。
