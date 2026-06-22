# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-06-22

## [1.0.0] - 2026-06-22

First standalone release of `sunhouse.info-card-custom`, extracted from `vtex.store-components` InfoCard (fork baseline v3.178.5).

### Added

- **`info-card-custom`** block — single Info Card under the Sunhouse vendor namespace
- **`list-context.info-card-list`** block — array of Info Cards with optional layout `children` (slider, responsive layouts, etc.), following the `vtex.store-image` list-context pattern
- **`blockClass` support** — list-level inheritance on `list-context.info-card-list`; per-item override; `string` or `string[]`; modifiers applied to shell handles, `CallToAction`, and Rich Text handles inside layout blocks via `InfoCardRichText`
- **`hasBackdrop`** prop — per-banner backdrop overlay toggle (full mode only); adds `--backdrop` modifier on `infoCardContainer`
- **`isHidden`** prop — per-banner visibility toggle; hidden items are filtered before render (no DOM node, no image request)
- **`formatIOUrl`** helper — resolves URL props from plain strings (`blocks.json`) or Site Editor IOMessage descriptors
- **`InfoCardRichText`** wrapper — forwards info-card `blockClass` modifiers to `vtex.rich-text` handles when composed inside layout blocks
- **`cssHandlesWithBlockClass.js`** — `normalizeBlockClass`, `resolveBlockClass`, `resolveHandlesWithBlockClass`
- Site Editor i18n via `react/messages/editorMessages.js` and `scripts/fix-i18n-messages.js`

### Changed

- Block renamed from `info-card-standalone` to **`info-card-custom`** (breaking change for themes)
- **`textMode` default** aligned with native VTEX InfoCard: `html` (was `rich-text`)
- i18n message keys trimmed from ~207 (store-components fork) to **53** Site Editor keys
- Locale files reduced to **`en`**, **`pt`**, and **`context.json`**
- Removed inherited **`settingsSchema`** (`enableDefaultSeller` from store-components fork)

### Fixed

- **`blockClass` inert on storefront** — prop wired through `useCssHandles` / manual modifier resolution for list-context items
- **Rich Text handles missing info-card modifiers inside slider** — `InfoCardRichText` applies list/item `blockClass` alongside layout modifiers
- **`imageActionUrl` breaking image in Site Editor** — IOMessage URL resolution + inner link layout (`infoCardImageLinkWrapper`, `w-100`)
- **`fix-i18n-messages.js` stripping schema keys** — preserves existing `editorMessages` ids and resolves `editorMessages.*` references from components

### Removed

- Fork artifacts: inherited store-components CHANGELOG history, unused TypeScript typings (`vtex.product-context`, `vtex.store-resources`, etc.)

---

Prior history belongs to upstream [`vtex.store-components`](https://github.com/vtex-apps/store-components). This app forked from InfoCard at v3.178.5.
