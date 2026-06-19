# Development Log - Info Card Custom

This document records the customizations, fixes, and improvements implemented in the `sunhouse.info-card-custom` app during development.

---

## 📅 Date: 18/06/2026

### 🎯 Session Objectives

- Rename exported block `info-card-standalone` → `info-card-custom` (align name with app identity `sunhouse.info-card-custom`)
- Fix `blockClass` not reaching CSS handles when declared in `blocks.json` (prop existed in schema but was not applied in the DOM)
- Move `blockClass` to **list level** on `list-context.info-card-list` so all cards in `infoCards[]` inherit the same class — no need to repeat it per array item
- Fix `blockClass` propagation from `list-context.info-card-list` to **all** CSS handles when Info Cards are rendered inside a layout child (e.g. `slider-layout`)
- Ensure Rich Text handles (`container`, `wrapper`, `heading`, `paragraph`, etc.) receive info-card modifiers (`--main-banner`, `--main-banner-home`) in addition to slider modifiers (`--banner`, `--banner-main`)
- Support `blockClass` as `string` or `string[]` in `blocks.json`, matching VTEX IO conventions
- Enable theme CSS porting from `vtex.store-components` selectors (e.g. `.heading--main-banner-home`) to `sunhouse.slider-layout.css` without selector remapping

---

## ✅ Implemented Changes (18/06/2026)

### 6. Block Rename — `info-card-standalone` → `info-card-custom`

**Goal:** Use a block name consistent with the app vendor/name (`sunhouse.info-card-custom`) and avoid confusion with the native `info-card` from `vtex.store-components`.

**Breaking change for themes:** Replace every `info-card-standalone` reference in theme `blocks.json` / templates with `info-card-custom`.

| Before | After |
| ------ | ----- |
| `"info-card-standalone#hero"` | `"info-card-custom#hero"` |
| Block key in `store/interfaces.json` | `info-card-custom` |

**Files modified:**

| File | Change |
| ---- | ------ |
| `store/interfaces.json` | Block key renamed to `info-card-custom` |
| `docs/README.md` | Examples and props tables updated |
| `docs/DEVELOPMENT_LOG.md` | All references updated |

**Status:** ✅ Implemented

---

### 7. `blockClass` Foundation — List-Level Inheritance + `useCssHandles` Wiring

**Goal:** Make `blockClass` actually generate CSS handle modifiers (`.infoCardContainer--my-class`) and define the correct placement for list vs. single-card usage.

**Problems identified (code review / chat):**

| Issue | Detail |
| ----- | ------ |
| `blockClass` inert on standalone card | Prop declared in `propTypes` / schema but never passed to `useCssHandles`; VTEX extension context applies it only when the component is the **registered IO block** |
| `blockClass` per `infoCards[]` item | Impractical — merchants had to repeat the same class on every array entry; items rendered via `<InfoCard {...props} />` have no IO block context |
| `CallToAction` handles ignored `blockClass` | Child component called `useCssHandles` without inheriting parent modifiers |

**How VTEX `useCssHandles` works (reference):**

Per [`vtex.css-handles`](https://github.com/vtex-apps/css-handles), the hook reads `blockClass` from the block extension context (`props.blockClass` / `content.blockClass`) and appends modifiers as `--{blockClass}` on each handle. When a component is rendered **programmatically** inside `list-context` (not as its own IO block instance), that context is missing — modifiers must be applied manually.

**Solution:**

1. **`react/modules/cssHandlesWithBlockClass.js`** — `resolveHandlesWithBlockClass(handles, withModifiers, blockClass)` applies missing modifiers via `withModifiers`, skipping handles that already contain them (avoids `--foo--foo` when extension context already applied the class on standalone blocks).

2. **`InfoCard`** — destructures `blockClass`; resolves handles before rendering; passes `blockClass` to `CallToAction`; exports `InfoCard.cssHandles = CSS_HANDLES`.

3. **`CallToAction`** — receives `blockClass` and resolves handles the same way.

4. **`InfoCardList`** — accepts `blockClass` on list props; passes it to `getInfoCardsAsJSXList(infoCards, blockClass)`; exposes `blockClass` in Site Editor schema.

5. **`store/contentSchemas.json`** — removed `blockClass` from per-item `InfoCard` definition; added `InfoCardList` definition with list-level `blockClass` + `infoCards`.

6. **`store/interfaces.json`** — `list-context.info-card-list` content `$ref` → `#/definitions/InfoCardList`.

**`blockClass` placement (theme `blocks.json`):**

```json
{
  "info-card-custom#hero": {
    "props": {
      "blockClass": "hero-home",
      "headline": "..."
    }
  },
  "list-context.info-card-list#banners": {
    "props": {
      "blockClass": "home-banners",
      "infoCards": [
        { "headline": "Card 1", "imageUrl": "..." },
        { "headline": "Card 2", "imageUrl": "..." }
      ]
    }
  }
}
```

**Theme CSS** (`styles/css/.../sunhouse.info-card-custom.css` or layout CSS when composed):

```css
.infoCardContainer--home-banners { /* all cards in the list */ }
.infoCardHeadline--hero-home { /* single card only */ }
```

**Status:** ✅ Implemented — extended same day in §8 (array `blockClass`, per-item override, Rich Text handles)

---

### 8. `blockClass` Propagation — Slider + Rich Text Handles

**Goal:** When `list-context.info-card-list` feeds cards into `slider-layout`, every CSS handle in the slide markup must expose the union of layout and info-card modifiers — same behavior merchants expect from native `info-card#banner-main`.

**Problem (confirmed on dev1 — `sunhouse-io_live1` theme):**

| Handle group | Before fix | Expected |
| ------------ | ---------- | -------- |
| Shell (`infoCardContainer`, `infoCardTextContainer`, `infoCardCallActionContainer`) | `--main-banner`, `--main-banner-home` ✅ | Same |
| Rich Text (`container`, `wrapper`, `heading`, `paragraph`, `headingLevel1`, …) | Only `--banner`, `--banner-main` (slider) ❌ | Slider **+** info-card modifiers |

**Root cause:** Info Cards inside `list-context` are rendered as React elements, not as IO blocks. Shell handles were already patched via `resolveHandlesWithBlockClass`, but `textMode: rich-text` used `vtex.rich-text` directly — its `useCssHandles` only inherited the **parent layout's** extension context (slider), not the info-card `blockClass`.

**Solution:**

1. **`InfoCardRichText`** — wrapper around `vtex.rich-text` that:
   - resolves Rich Text handles in the slider's CSS namespace (`useCssHandles`)
   - applies info-card `blockClass` modifiers via `resolveHandlesWithBlockClass`
   - passes resolved classes to Rich Text through `useCustomClasses` + `classes` prop

2. **`cssHandlesWithBlockClass.js`** — extended helpers:
   - `normalizeBlockClass()` — accepts `string` or `string[]`
   - `resolveBlockClass(listBlockClass, itemBlockClass)` — per-item overrides list-level
   - `resolveHandlesWithBlockClass()` — applies only **missing** modifiers (avoids duplicate `--foo` classes)

3. **`infoCardsAsList.js`** — uses `resolveBlockClass()` instead of discarding per-item `blockClass`

**Files created:**

| File | Purpose |
| ---- | ------- |
| `react/components/InfoCard/InfoCardRichText.js` | Rich Text wrapper with blockClass-aware CSS handles |

**Files modified:**

| File | Change |
| ---- | ------ |
| `react/modules/cssHandlesWithBlockClass.js` | Array `blockClass` support; `normalizeBlockClass`, `resolveBlockClass`; idempotent modifier application |
| `react/modules/infoCardsAsList.js` | Per-item `blockClass` priority over list-level |
| `react/components/InfoCard/index.js` | `RichText` → `InfoCardRichText`; `blockClass` propType `string \| string[]` |
| `react/components/InfoCardList/index.js` | `blockClass` propType `string \| string[]` |

**`blockClass` priority (runtime):**

```
1. blockClass from slider-layout child block     → e.g. ["banner", "banner-main"]
2. blockClass from infoCards[i] (if set)         → overrides list-level for that card
3. blockClass from list-context.info-card-list   → fallback, e.g. ["main-banner", "main-banner-home"]
```

Each modifier is applied individually (`--banner`, `--banner-main`, `--main-banner`, `--main-banner-home`). No chained modifiers like `--banner--main-banner`.

**Expected DOM (example — `textMode: rich-text`):**

```html
<h1 class="sunhouse-slider-layout-0-x-heading
           sunhouse-slider-layout-0-x-heading--banner
           sunhouse-slider-layout-0-x-heading--banner-main
           sunhouse-slider-layout-0-x-heading--main-banner
           sunhouse-slider-layout-0-x-heading--main-banner-home">
```

**Theme reference (`blocks.json`):**

```json
{
  "list-context.info-card-list#banner-main": {
    "children": ["slider-layout#banner-main-slider"],
    "props": {
      "blockClass": ["main-banner", "main-banner-home"],
      "infoCards": [ /* headline, subhead, bodyText, imageUrl, … */ ]
    }
  },
  "slider-layout#banner-main-slider": {
    "props": {
      "blockClass": ["banner", "banner-main"]
    }
  }
}
```

**Note on `textMode`:** Rich Text handles (`container`, `heading`, `paragraph`, …) only appear when `textMode` is `"rich-text"`. With the default `"html"`, text uses Info Card shell handles (`infoCardHeadline`, `infoCardSubhead`, `infoCardBodyText`), which were already receiving info-card modifiers before this fix.

**Status:** ✅ Implemented — `vtex link` build succeeds on dev workspace

---

## 📅 Date: 17/06/2026

### 🎯 Session Objectives

- Understand the differences between the standalone Sunhouse app and the native `info-card` block from `vtex.store-components`
- Align `textMode` default behavior with the original VTEX Store Components InfoCard (`html`, not `rich-text`)
- Create a list wrapper (`list-context.info-card-list`) following the same pattern as `vtex.store-image`'s `list-context.image-list`
- Support an array of Info Cards with individual configuration per item
- Support **optional** `children` so themes can compose with layout blocks (`slider-layout`, `flex-layout`, responsive layouts, etc.)
- When no `children` are declared, render 1 or N Info Cards directly on the storefront (natural sequential layout)
- Validate integration via `vtex link` on the dev workspace
- Resolve i18n build warnings (locale parity + static message extraction)

---

## 📋 Development Summary

The app is a **standalone extract** of the `InfoCard` component from [`vtex.store-components`](https://developers.vtex.com/docs/apps/vtex.store-components) (originally forked at v3.178.5). Instead of depending on the full Store Components collection (~20 blocks), it ships only Info Card functionality under a dedicated vendor namespace.

**Architectural pattern (list wrapper):**

```
infoCards[] → getInfoCardsAsJSXList() → [<InfoCard />, ...]
  → useListContext (optional parent list)
  → ListContextProvider (when children exist)
  → children (slider-layout, etc.) consume list via vtex.list-context
  OR
  → direct fragment render (when no children)
```

**Key outcome:** Merchants can configure multiple Info Cards in the Site Editor or `blocks.json`, optionally wrapping them in any VTEX layout block that consumes `list-context` — same ergonomics as [`vtex.store-image`](https://developers.vtex.com/docs/apps/vtex.store-image).

**App identity:** `sunhouse.info-card-custom` v0.0.1

**Main blocks:**

| Block | Purpose |
| ----- | ------- |
| `info-card-custom` | Single Info Card |
| `list-context.info-card-list` | Array of Info Cards + optional layout `children` |

**Comparison with native VTEX (pre-session):**

| Aspect | `vtex.store-components` | `sunhouse.info-card-custom` |
| ------ | ------------------------- | ----------------------------- |
| Block name | `info-card` | `info-card-custom` |
| Scope | Full component collection | Info Card only |
| `textMode` default | `html` | Was `rich-text` → **fixed to `html`** |
| List/array support | Not built-in | `list-context.info-card-list` |

---

## ✅ Implemented Changes (17/06/2026)

### 1. `textMode` Alignment with `vtex.store-components`

**Goal:** Match the original InfoCard default so new cards render HTML-sanitized content by default, not Rich Text / markdown.

**Problem:** The Sunhouse fork had diverged from upstream — `textMode` defaulted to `rich-text` in three places while `vtex.store-components` uses `html`.

**Files modified:**

| File | Change |
| ---- | ------ |
| `react/components/InfoCard/index.js` | `defaultProps.textMode` → `TEXT_MODE_HTML`; schema default → `TEXT_MODE_HTML` |
| `store/contentSchemas.json` | `textMode.default` → `"html"` |

**Enum values (unchanged):**

| Value | Behavior |
| ----- | -------- |
| `html` | `headline`, `subhead`, `bodyText` rendered via `SanitizedHTML` |
| `rich-text` | Same fields rendered via `vtex.rich-text` (markdown) |

**Status:** ✅ Implemented

---

### 2. `list-context.info-card-list` — List Wrapper Component

**Goal:** Enable an array of Info Cards with per-item props, compatible with VTEX list-context composition (slider, responsive layouts, etc.).

**Reference implementation:** `vtex.store-image` → `react/ImageList.tsx`, `store/interfaces.json` → `list-context.image-list`

**Files created:**

| File | Purpose |
| ---- | ------- |
| `react/components/InfoCardList/index.js` | Wrapper — builds list context, optional children |
| `react/modules/infoCardsAsList.js` | Maps `infoCards[]` → `<InfoCard key={index} {...props} />` |
| `react/InfoCardList.js` | VTEX IO entry point export |
| `react/typings/vtex.list-context.d.ts` | TypeScript declarations for `vtex.list-context` |

**Files modified:**

| File | Change |
| ---- | ------ |
| `store/interfaces.json` | Registered `list-context.info-card-list` with `composition: "children"`, `allowed: "*"` |
| `store/contentSchemas.json` | Added `InfoCards` array definition (`items` → `$ref` to `InfoCard`); added `"type": "object"` to `InfoCard` |
| `manifest.json` | Added dependency `vtex.list-context@0.x` |

**Runtime behavior:**

| Scenario | Behavior |
| -------- | -------- |
| `children` empty / omitted | Renders all `infoCards` sequentially in a React fragment |
| `children` present (e.g. `slider-layout`) | Pushes Info Card elements into `ListContextProvider`; child block consumes the list |

**Core logic (`InfoCardList`):**

```js
const list = useListContext()?.list ?? []
const infoCardListContent = getInfoCardsAsJSXList(infoCards, blockClass)
const newListContextValue = list.concat(infoCardListContent)

if (childArray.length === 0) {
  return <>{infoCardListContent}</>
}

return (
  <ListContextProvider list={newListContextValue}>
    {children}
  </ListContextProvider>
)
```

**Status:** ✅ Implemented — validated with `vtex link` on dev workspace

---

### 3. Store Interfaces and Content Schemas

**Goal:** Expose both single-card and list blocks with Site Editor support.

**`store/interfaces.json`:**

```json
{
  "info-card-custom": {
    "component": "InfoCard",
    "content": {
      "$ref": "app:sunhouse.info-card-custom#/definitions/InfoCard"
    }
  },
  "list-context.info-card-list": {
    "component": "InfoCardList",
    "composition": "children",
    "allowed": "*",
    "content": {
      "$ref": "app:sunhouse.info-card-custom#/definitions/InfoCardList"
    }
  }
}
```

**`infoCards` array:** Each item accepts the same props as `info-card-custom` (via `$ref` to `InfoCard` definition), **except** list-level `blockClass` is the default for every card. A per-item `blockClass` (optional) overrides the list value for that card only — see §7–§8 (18/06/2026).

**`blockClass` on lists:** Declared on `list-context.info-card-list` props; passed to each `<InfoCard />` and applied to all CSS handles — shell handles, `CallToAction`, and (when `textMode: rich-text`) Rich Text handles via `InfoCardRichText`. Accepts `string` or `string[]`.

**Status:** ✅ Implemented

---

### 4. i18n — Info Card List Site Editor Labels

**Goal:** Provide translatable labels for the new list block in Site Editor.

**Keys added:**

| Key | EN | PT |
| --- | -- | -- |
| `admin/editor.info-card-list.title` | Info Card List | Lista de Info Cards |
| `admin/editor.info-card-list.description` | Renders a list of Info Cards… | Renderiza uma lista de Info Cards… |
| `admin/editor.info-card-list.infoCards.title` | Info Cards | Info Cards |

**Files modified:** `messages/en.json`, `messages/pt.json`, `messages/context.json` (+ other locale files in repo)

**Status:** ✅ Implemented — initial keys added; full cleanup in §6 below

---

### 6. i18n — Message Cleanup & Static Extraction

**Goal:** Eliminate `vtex link` i18n warnings: locale parity mismatches and *"React builder could not extract messages"*.

**Problems:**

| Warning | Cause |
| ------- | ----- |
| `Messages between language "X" and "en" are different` | New keys existed in `en.json` but were missing in other locale files |
| `React builder could not parse automatically all messages` | Fork still shipped ~207 `store-components` message keys; schemas referenced message IDs as plain strings instead of `defineMessages` |

**Approach:**

1. **Scope reduction** — Keep only message IDs actually used by Info Card / Info Card List (`react/` + `store/contentSchemas.json`): **207 → 49 keys** across all `messages/*.json` files.
2. **Static declaration** — Centralize Site Editor labels in `react/messages/editorMessages.js` using `defineMessages` from `react-intl`.
3. **Component wiring** — Schemas and enum labels reference `editorMessages.*.id` instead of string literals.

**Files created:**

| File | Purpose |
| ---- | ------- |
| `react/messages/editorMessages.js` | `defineMessages` for all 49 Site Editor / schema message IDs |
| `scripts/fix-i18n-messages.js` | Regenerates `editorMessages.js` and filters locale files from code usage (re-run when adding schema keys) |

**Files modified:**

| File | Change |
| ---- | ------ |
| `messages/*.json` (17 locales + `context.json`) | Trimmed to 49 keys; parity restored across all languages |
| `react/components/InfoCard/index.js` | Schema titles/descriptions → `editorMessages.*.id` |
| `react/components/InfoCardList/index.js` | Schema title/description → `editorMessages.*.id` |
| `react/components/InfoCard/SchemaTypes.js` | Enum `name` fields → `editorMessages.*.id` |
| `react/InfoCard.js`, `react/InfoCardList.js` | Side-effect import of `editorMessages` for builder extraction |

**Maintainer workflow (new schema message):**

1. Add the message ID string to `store/contentSchemas.json` and/or component schema as today.
2. Run `node scripts/fix-i18n-messages.js` to sync `editorMessages.js` and all locale files.
3. Replace any new string literals in React with `editorMessages.<key>.id`.
4. Add translations in `messages/en.json` / `messages/pt.json` (or rely on script fallback from `en`).

**Status:** ✅ Implemented — `vtex link` completes without i18n warnings

---

### 5. Theme Integration Examples (Documented in Chat)

**Single card — all props:**

```json
{
  "info-card-custom#exemplo-completo": {
    "props": {
      "blockClass": "info-card-exemplo",
      "htmlId": "info-card-hero",
      "isFullModeStyle": false,
      "textMode": "html",
      "headline": "Título principal",
      "subhead": "Subtítulo do card",
      "bodyText": "Texto de corpo",
      "textPosition": "left",
      "textAlignment": "left",
      "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
      "mobileImageUrl": "",
      "imageAltText": "Descrição da imagem para SEO",
      "imageActionUrl": "/departamento/exemplo",
      "linkTarget": "_self",
      "callToActionMode": "button",
      "callToActionText": "COMPRAR AGORA",
      "callToActionUrl": "/produto/exemplo/p",
      "callToActionLinkTarget": "_self",
      "fetchpriority": "auto",
      "preload": false
    }
  }
}
```

**List without children (direct render):**

```json
{
  "list-context.info-card-list#lista-direta": {
    "props": {
      "blockClass": "lista-direta",
      "infoCards": [
        { "headline": "Card 1", "imageUrl": "https://...", "callToActionMode": "button", "callToActionText": "VER", "callToActionUrl": "/1" },
        { "headline": "Card 2", "isFullModeStyle": true, "imageUrl": "https://...", "textPosition": "center" }
      ]
    }
  }
}
```

**List with children (layout consumes list):**

```json
{
  "list-context.info-card-list#com-layout": {
    "children": ["slider-layout#demo"],
    "props": {
      "blockClass": "com-layout",
      "infoCards": [
        { "headline": "Slide 1", "imageUrl": "https://..." },
        { "headline": "Slide 2", "imageUrl": "https://..." }
      ]
    }
  },
  "slider-layout#demo": {
    "props": {
      "itemsPerPage": { "desktop": 1, "tablet": 1, "phone": 1 }
    }
  }
}
```

> Theme must declare the layout app dependency (e.g. `vtex.slider-layout` or `sunhouse.slider-layout`).

**Status:** ✅ Documented — user confirmed working via `vtex link`

---

## 📝 Technical Notes

### InfoCard Props (Full Set)

Props supported by the React component (some only via `blocks.json`, not Site Editor — see Pending):

| Prop | Type | Default | Site Editor |
| ---- | ---- | ------- | ----------- |
| `blockClass` | `string` \| `string[]` | — | ✅ |
| `htmlId` | string | — | ❌ |
| `isFullModeStyle` | boolean | `false` | ✅ |
| `textMode` | `html` \| `rich-text` | `html` | ✅ |
| `headline` | string | `""` | ✅ |
| `subhead` | string | `""` | ✅ |
| `bodyText` | string | `""` | ✅ |
| `textPosition` | `left` \| `center` \| `right` | `left` | ✅ |
| `textAlignment` | `left` \| `center` \| `right` | `left` | ✅ |
| `imageUrl` | string (URL) | `""` | ✅ |
| `mobileImageUrl` | string (URL) | `""` | ✅ |
| `imageAltText` | string | `""` | ❌ |
| `imageActionUrl` | string (URL) | `""` | ✅ |
| `linkTarget` | `_self` \| `_blank` \| `_parent` \| `_top` | `_self` | ❌ |
| `callToActionMode` | `none` \| `button` \| `link` | `button` | ✅ |
| `callToActionText` | string | `""` | ✅ |
| `callToActionUrl` | string (URL) | `""` | ✅ |
| `callToActionLinkTarget` | `_self` \| `_blank` \| `_parent` \| `_top` | `_self` | ⚠️ Editor: `_self` / `_blank` only |
| `fetchpriority` | `auto` \| `high` \| `low` | `auto` | ❌ |
| `preload` | boolean | `false` | ❌ |

### CSS Handles

Same as native `vtex.store-components` InfoCard:

`infoCardContainer`, `infoCardTextContainer`, `infoCardHeadline`, `infoCardSubhead`, `infoCardBodyText`, `infoCardImageContainer`, `infoCardImage`, `infoCardImageLinkWrapper`, `infoCardCallActionContainer`, `infoCardCallActionText`

When `textMode` is `"rich-text"` and the card is inside a layout block (e.g. `slider-layout`), text fields also expose Rich Text handles from the **layout app's CSS namespace** (e.g. `sunhouse-slider-layout-0-x-heading`), with both layout and info-card `blockClass` modifiers applied.

Custom styles via theme: `styles/css/sunhouse.info-card-custom.css` (requires `styles` builder — not yet added; see Pending). For list + slider composition, theme CSS typically targets the layout app's CSS file (e.g. `sunhouse.slider-layout.css`).

### `blockClass` in list-context + layout composition

Info Cards pushed via `ListContextProvider` are React elements, not IO block instances. The app manually applies `blockClass` modifiers through `resolveHandlesWithBlockClass` so theme selectors like `.infoCardContainer--main-banner-home` and `.heading--main-banner-home` work without remapping.

Helper module: `react/modules/cssHandlesWithBlockClass.js`

### Dependencies (Lean Set)

```
vtex.css-handles, vtex.list-context, vtex.native-types, vtex.render-runtime, vtex.rich-text
```

`react/package.json` also declares `react-intl` (used for `defineMessages` in Site Editor schemas).

### i18n (Messages)

| Aspect | Detail |
| ------ | ------ |
| Locale files | 17 languages + `context.json` (inherited file set from fork; **content** trimmed to 49 keys each) |
| Message scope | Site Editor labels for Info Card + Info Card List only — no storefront `store/*` strings (not used by this app) |
| Static extraction | `react/messages/editorMessages.js` — all schema message IDs declared via `defineMessages` |
| Regeneration | `node scripts/fix-i18n-messages.js` after adding keys to schemas |

### Intentionally Not Included (vs. Full Fork)

The repo still contains artifacts from the original `vtex.store-components` fork (full CHANGELOG, unused typings). Only Info Card + Info Card List are actively maintained. Locale **files** were kept for parity with the fork; locale **keys** were trimmed to the standalone app scope (see §6).

### `isFullModeStyle` Behavior

When `true`: image becomes CSS background; `textAlignment` is ignored (uses `textPosition` for layout). When `false`: side-by-side text + image layout.

---

## 🐛 Bugs Fixed

| # | Issue | Cause | Fix | Status |
| - | ----- | ----- | --- | ------ |
| 1 | `textMode` default differed from VTEX native | Fork inherited `rich-text` as default in component + contentSchemas | Aligned all defaults to `html` | ✅ |
| 2 | Locale parity warnings on `vtex link` | New i18n keys missing in several `messages/*.json` files | Added missing keys; later consolidated in §6 | ✅ |
| 3 | `React builder could not extract messages` | ~207 fork messages in bundle; dynamic string IDs in schemas | Trimmed to 49 keys + `editorMessages.js` with `defineMessages` | ✅ |
| 4 | `blockClass` had no effect in storefront | Prop in schema but not wired to `useCssHandles`; list items lack IO block context | `cssHandlesWithBlockClass.js` + list-level `blockClass` inheritance (§7) | ✅ |
| 5 | Rich Text handles missing info-card `blockClass` inside slider | `vtex.rich-text` only inherited slider extension context; info-card `blockClass` not forwarded | `InfoCardRichText` wrapper + array `blockClass` support in `cssHandlesWithBlockClass.js` (§8) | ✅ |
| 6 | Block name `info-card-standalone` inconsistent with app id | Initial export name before rename | Renamed to `info-card-custom` (§6) | ✅ |

`vtex link` succeeds without i18n warnings after §6.

---

## ✅ QA Checklist (17/06/2026)

Use after `vtex link` with theme dependency `sunhouse.info-card-custom`.

### Theme setup

- [x] `sunhouse.info-card-custom` declared in theme `manifest.json`
- [x] `vtex link` completes without builder errors
- [x] `vtex link` completes without i18n warnings (locale parity + static message extraction)

### `info-card-custom`

- [x] Single card renders with headline, image, CTA
- [x] Block registered as `info-card-custom` (not `info-card-standalone`)
- [x] `blockClass` on single card generates `--{blockClass}` modifiers on CSS handles
- [x] `textMode: html` default applies when prop omitted
- [x] `isFullModeStyle: true` renders background image layout
- [x] `callToActionMode: none` hides CTA

### `list-context.info-card-list`

- [x] List-level `blockClass` inherited by all cards without repeating per `infoCards[]` item
- [x] Multiple cards in `infoCards` render sequentially without `children`
- [x] Cards render inside `slider-layout` when declared as `children` (requires `vtex.slider-layout` in theme)
- [ ] Responsive layout children (`responsive-layout.desktop#…`) consume list correctly
- [ ] Site Editor: **+ ADICIONAR** on Info Cards array; per-item props editable
- [ ] Saving/reopening list block preserves card order and values

### `blockClass` + slider (18/06/2026)

- [ ] Shell handles (`infoCardContainer`, `infoCardTextContainer`, `infoCardCallActionContainer`) show list `blockClass` modifiers inside slider
- [ ] Rich Text handles (`container`, `wrapper`, `heading`, `paragraph`) show **both** slider and info-card modifiers when `textMode: rich-text`
- [ ] Selectors like `.heading--main-banner-home` work in theme `sunhouse.slider-layout.css`
- [ ] Multiple `blockClass` values (`["main-banner", "main-banner-home"]`) each generate separate `--{value}` modifiers

### Site Editor vs. blocks.json

- [ ] Props only in component (`htmlId`, `imageAltText`, `fetchpriority`, `preload`, `linkTarget`) configurable via `blocks.json` but not visible in Site Editor

---

## 🔄 Pending / TODO

### Blocking v1 publish

- [ ] **Remove stale `settingsSchema`** — `manifest.json` still references `vtex.store-components` / `enableDefaultSeller` (copied from fork; irrelevant to Info Card)
- [ ] **Publish app** — `vtex publish` after full QA on dev workspace
- [ ] **Theme version** — pin published `sunhouse.info-card-custom` version in theme `manifest.json` (all environments)

### Site Editor parity

- [ ] **Add missing props to `contentSchemas.json`** — `htmlId`, `imageAltText`, `fetchpriority`, `preload`, `linkTarget` (SEO/performance fields currently blocks.json-only)
- [ ] **Extend `callToActionLinkTarget` enum in contentSchemas** — add `_parent` and `_top` to match component propTypes

### Documentation & hygiene

- [x] **Update `docs/README.md`** — documents `list-context.info-card-list`, block names, and theme examples
- [x] **Trim fork message keys** — `messages/*.json` reduced from ~207 to 49 keys (see §6); locale file count unchanged
- [ ] **Trim fork artifacts** — CHANGELOG from full store-components history; unused typings (`vtex.product-context`, etc.); optionally reduce locale **files** to `en`, `pt`, `context.json`
- [ ] **Add `styles` builder** to `manifest.json` if theme CSS customization via `sunhouse.info-card-custom.css` is desired
- [ ] **Add `CHANGELOG.md` entry** for v0.0.1 / list wrapper feature (or replace inherited store-components changelog)

### Backlog (future releases)

- [ ] **`info-card-list` without list-context** — optional static block (like `image-list` vs `list-context.image-list`) if direct array render without composition overhead is needed as a separate interface
- [ ] **Automated tests** — unit tests for `getInfoCardsAsJSXList`, `InfoCardList` children/no-children branches
- [ ] **Unique React keys** — replace array `index` keys with stable id (`htmlId` or hash) when cards are reordered in Site Editor
- [ ] **Custom SEO/markup enhancements** — original motivation for standalone app ("partially recreated based on SEO"); evaluate semantic HTML, heading levels, structured data
- [ ] **Sync with upstream** — periodically diff against `vtex-apps/store-components` InfoCard for bugfixes (fetchpriority, lazy load, etc.)

---

## 📊 Development Report (Brief)

| Metric | Value |
| ------ | ----- |
| Starting point | `vtex.store-components` InfoCard fork (v3.178.5 codebase) |
| Final scope | Standalone Info Card app + list-context wrapper |
| New core files | `InfoCardList`, `infoCardsAsList.js`, `InfoCardRichText.js`, `cssHandlesWithBlockClass.js`, `vtex.list-context` typings, `editorMessages.js` |
| Blocks exported | `info-card-custom`, `list-context.info-card-list` |
| Alignment fixes | 1 (`textMode` default) |
| Block rename | `info-card-standalone` → `info-card-custom` |
| CSS handle fixes | 2 (`blockClass` foundation §7; Rich Text + slider propagation §8) |
| i18n cleanup | 207 → 49 message keys; `defineMessages` for static extraction |
| New dependency | `vtex.list-context@0.x` |
| Build blockers | 0 |
| Runtime blockers | 0 |
| QA status | ✅ Basic `vtex link` + single/list render + slider blockClass fix; full slider/responsive QA pending |

---

## 📚 References

- [VTEX Store Components](https://developers.vtex.com/docs/apps/vtex.store-components) — native `info-card` block
- [VTEX Store Image](https://developers.vtex.com/docs/apps/vtex.store-image) — `list-context.image-list` pattern reference
- [VTEX list-context](https://github.com/vtex-apps/list-context) — list composition provider
- [VTEX Slider Layout](https://developers.vtex.com/docs/apps/vtex.slider-layout) — typical child block for list-context sliders
- [VTEX IO — Using CSS handles](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization)
- [vtex.css-handles](https://github.com/vtex-apps/css-handles) — `useCssHandles`, `withModifiers`, extension `blockClass` resolution
- Upstream source: [vtex-apps/store-components — InfoCard](https://github.com/vtex-apps/store-components/tree/master/react/components/InfoCard)
