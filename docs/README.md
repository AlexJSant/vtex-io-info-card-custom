# Info Card Custom

Standalone VTEX IO app based on the [`info-card`](https://developers.vtex.com/docs/apps/vtex.store-components) block from `vtex.store-components`. It ships the Info Card as an independent app under the `sunhouse` vendor namespace, with a list wrapper compatible with VTEX `list-context` composition (same pattern as [`vtex.store-image`](https://developers.vtex.com/docs/apps/vtex.store-image)).

<!-- ![image](/assets/images/vtex-io-info-card-custom-02.gif) -->
<br/>
<p align="center">
  <img src="/assets/images/vtex-io-info-card-custom-02.gif" alt="image">
</p>
<br/>

**App identity:** `sunhouse.info-card-custom`

For implementation history, QA status, and pending work, see [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md).

---

## Blocks

| Block | Description |
| ----- | ----------- |
| `info-card-custom` | Single Info Card with text, image, and optional call-to-action |
| `list-context.info-card-list` | Array of Info Cards (`infoCards` prop) with optional `children` for layout composition (e.g. `slider-layout`) |

> **Migration:** If upgrading from an earlier dev build that used `info-card-standalone`, rename the block to `info-card-custom` in theme `blocks.json` and templates.

---

## Configuration

### 1. Theme dependency

Add the app to your store theme `manifest.json`:

```json
{
  "dependencies": {
    "sunhouse.info-card-custom": "0.x"
  }
}
```

If you use `list-context.info-card-list` with a slider, also declare the layout app (e.g. `vtex.slider-layout` or your custom slider app).

### 2. Register blocks and add to a template

Define blocks in `store/blocks.json` (or split files) and reference them from a template, e.g. `store/blocks/home.json`:

```json
{
  "store.home": {
    "blocks": [
      "info-card-custom#example",
      "list-context.info-card-list#home-banners"
    ]
  }
}
```

### 3. Single Info Card

Add `info-card-custom` to the desired template and configure its props:

```json
{
  "info-card-custom#example": {
    "props": {
      "blockClass": "info-card-example",
      "htmlId": "info-card-hero",
      "isFullModeStyle": false,
      "textMode": "html",
      "headline": "Clearance Sale",
      "subhead": "Limited time offers",
      "bodyText": "Check out our best deals",
      "textPosition": "left",
      "textAlignment": "center",
      "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
      "mobileImageUrl": "",
      "imageAltText": "Clearance sale banner",
      "imageActionUrl": "/sale/d",
      "linkTarget": "_self",
      "callToActionMode": "button",
      "callToActionText": "DISCOVER",
      "callToActionUrl": "/sale/d",
      "callToActionLinkTarget": "_self",
      "fetchpriority": "auto",
      "preload": false
    }
  }
}
```

### 4. Info Card list (direct render)

When `children` is omitted, all items in `infoCards` are rendered sequentially on the page:

```json
{
  "list-context.info-card-list#home-banners": {
    "props": {
      "blockClass": "home-banners",
      "infoCards": [
        {
          "headline": "Card 1",
          "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
          "callToActionMode": "button",
          "callToActionText": "SEE MORE",
          "callToActionUrl": "/promo-1"
        },
        {
          "headline": "Card 2",
          "isFullModeStyle": true,
          "textPosition": "center",
          "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
          "callToActionMode": "link",
          "callToActionText": "Learn more",
          "callToActionUrl": "/promo-2"
        }
      ]
    }
  }
}
```

### 5. Info Card list with layout children

When `children` is declared, the list is passed to the child block via `vtex.list-context` (e.g. one card per slide):

```json
{
  "list-context.info-card-list#slider": {
    "children": ["slider-layout#info-cards"],
    "props": {
      "blockClass": "info-cards-slider",
      "infoCards": [
        {
          "headline": "Slide 1",
          "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
          "callToActionText": "VIEW",
          "callToActionUrl": "/1"
        },
        {
          "headline": "Slide 2",
          "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
          "callToActionText": "VIEW",
          "callToActionUrl": "/2"
        }
      ]
    }
  },
  "slider-layout#info-cards": {
    "props": {
      "itemsPerPage": {
        "desktop": 1,
        "tablet": 1,
        "phone": 1
      },
      "infinite": true
    }
  }
}
```

**Home banner pattern (list + slider with separate `blockClass` values):**

Use list-level `blockClass` for info-card styling and slider `blockClass` for layout styling. Both sets of modifiers appear on each slide's CSS handles:

```json
{
  "list-context.info-card-list#banner-main": {
    "children": ["slider-layout#banner-main-slider"],
    "props": {
      "blockClass": ["main-banner", "main-banner-home"],
      "infoCards": [
        {
          "textMode": "rich-text",
          "headline": "# Summer Sale",
          "subhead": "Up to 50% off",
          "bodyText": "Shop now",
          "isFullModeStyle": true,
          "hasBackdrop": true,
          "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
          "textPosition": "center"
        },
        {
          "textMode": "rich-text",
          "headline": "# New Arrivals",
          "subhead": "Fresh styles",
          "isFullModeStyle": true,
          "hasBackdrop": false,
          "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
          "textPosition": "center"
        },
        {
          "textMode": "rich-text",
          "headline": "# Christmas",
          "subhead": "Coming soon",
          "isFullModeStyle": true,
          "hasBackdrop": true,
          "imageUrl": "https://storecomponents.vteximg.com.br/arquivos/banner-infocard2.png",
          "textPosition": "center",
          "isHidden": true
        }
      ]
    }
  },
  "slider-layout#banner-main-slider": {
    "props": {
      "blockClass": ["banner", "banner-main"],
      "itemsPerPage": { "desktop": 1, "tablet": 1, "phone": 1 },
      "infinite": true
    }
  }
}
```

Each object inside `infoCards` accepts the same content props as `info-card-custom` (headline, image, CTA, etc.). For styling, declare `blockClass` **once on the list** — every card inherits it. An optional per-item `blockClass` overrides the list value for that card only. Use `hasBackdrop` per item to toggle the dark overlay on full-mode banners independently. Use `isHidden` per item to keep a banner's configuration in the array while skipping DOM render (ideal for seasonal banners).

---

## Props

### `info-card-custom` props

Applies to the single-card block and to each item in `list-context.info-card-list` → `infoCards` (content fields only; see list props for `blockClass`).

| Prop name | Type | Description | Default value | Site Editor |
| --------- | ---- | ----------- | ------------- | ----------- |
| `blockClass` | `string` \| `string[]` | Extra class name(s) for custom styling. On **single cards**, set here. On **lists**, prefer the list-level prop (below). Multiple values generate separate modifiers (e.g. `--main-banner`, `--main-banner-home`) | — | ✅ |
| `htmlId` | `string` | ID of the container element | — | ❌ |
| `isFullModeStyle` | `boolean` | If `true`, image is used as background and text is displayed over it | `false` | ✅ |
| `hasBackdrop` | `boolean` | Adds `--backdrop` modifier on `infoCardContainer` for theme overlay styling. Only applies when `isFullModeStyle` is `true` | `false` | ✅ |
| `isHidden` | `boolean` | When `true`, the banner is not rendered in the DOM. Useful for seasonal banners without removing configuration | `false` | ✅ |
| `textMode` | `TextModeEnum` | How `headline`, `subhead`, and `bodyText` are processed | `"html"` | ✅ |
| `headline` | `string` | Headline of the Info Card | `""` | ✅ |
| `subhead` | `string` | Text underneath the headline | `""` | ✅ |
| `bodyText` | `string` | Text underneath the subhead | `""` | ✅ |
| `textPosition` | `TextPositionEnum` | Position of the text: `left`, `center`, or `right` | `"left"` | ✅ |
| `textAlignment` | `TextAlignmentEnum` | Text alignment inside the component. Ignored when `isFullModeStyle` is `true` | `"left"` | ✅ |
| `imageUrl` | `string` | Image URL for desktop | `""` | ✅ |
| `mobileImageUrl` | `string` | Image URL for mobile. Falls back to `imageUrl` when empty | `""` | ✅ |
| `imageAltText` | `string` | Alternative text for the `<img>` (SEO). **Half mode only** — no effect in full-mode | `""` | ❌ |
| `imageActionUrl` | `string` | URL when the image is clicked | `""` | ✅ |
| `linkTarget` | `LinkTargetEnum` | Target when the Info Card wrapper link is used | `"_self"` | ❌ |
| `callToActionMode` | `CallToActionEnum` | CTA display mode | `"button"` | ✅ |
| `callToActionText` | `string` | CTA label | `""` | ✅ |
| `callToActionUrl` | `string` | CTA URL | `""` | ✅ |
| `callToActionLinkTarget` | `LinkTargetEnum` | Target for the CTA link | `"_self"` | ⚠️ `_self` / `_blank` only |
| `fetchpriority` | `string` | Image fetch priority on the `<img>` tag: `high`, `low`, or `auto`. **Half mode only** — no effect in full-mode (background-image) | `"auto"` | ❌ |
| `preload` | `boolean` | Sets `data-vtex-preload` on the `<img>`. **Half mode only** — no effect in full-mode | `false` | ❌ |

Props marked ❌ work via `blocks.json` but are not exposed in the Site Editor. `imageAltText`, `fetchpriority`, and `preload` target the `<img>` element, which is not rendered when `isFullModeStyle` is `true`.

### `list-context.info-card-list` props

| Prop name | Type | Description | Site Editor |
| --------- | ---- | ----------- | ----------- |
| `blockClass` | `string` \| `string[]` | CSS class(es) applied to **every** card in the list (generates handles like `.infoCardContainer--{blockClass}`). Per-item `blockClass` in `infoCards[]` overrides this for that card | ✅ |
| `infoCards` | `array` | Array of Info Card configuration objects (same props as `info-card-custom`) | ✅ |
| `children` | blocks | Optional. Layout blocks that consume the list via `vtex.list-context`. When omitted, cards render directly | — |

---

### `TextPositionEnum` possible values

| Enum name | Enum value | Description |
| --------- | ---------- | ----------- |
| Left | `left` | Text on the left. When `isFullModeStyle` is `false`, image is on the right |
| Center | `center` | Text in the center. Only applicable when `isFullModeStyle` is `true` |
| Right | `right` | Text on the right. When `isFullModeStyle` is `false`, image is on the left |

### `CallToActionEnum` possible values

| Enum name | Enum value | Description |
| --------- | ---------- | ----------- |
| None | `none` | Does not render any call-to-action |
| Button | `button` | Renders the CTA as a button |
| Link | `link` | Renders the CTA as a text link |

### `LinkTargetEnum` possible values

Same values supported by HTML5 anchor tags. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a).

| Enum name | Enum value | Description |
| --------- | ---------- | ----------- |
| Self (default) | `_self` | Opens in the current browsing context |
| Blank | `_blank` | Opens in a new tab |
| Parent | `_parent` | Opens in the parent browsing context |
| Top | `_top` | Opens in the topmost browsing context |

### `TextModeEnum` possible values

| Enum name | Enum value  | Description |
| --------- | ----------- | ----------- |
| HTML | `html` | Uses sanitized HTML for `headline`, `subhead`, and `bodyText` |
| Rich Text | `rich-text` | Uses markdown via [`vtex.rich-text`](https://github.com/vtex-apps/rich-text) |

---

## Customization

To apply CSS customizations, see the [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization) guide.

### Info Card handles

| CSS Handles |
| ----------- |
| `infoCardCallActionContainer` |
| `infoCardCallActionText` |
| `infoCardContainer` |
| `infoCardHeadline` |
| `infoCardImage` |
| `infoCardImageContainer` |
| `infoCardImageLinkWrapper` |
| `infoCardSubhead` |
| `infoCardBodyText` |
| `infoCardTextContainer` |

Use `blockClass` to target specific instances: `.infoCardContainer--my-banner`.

**Why list-level `blockClass`?** Items inside `infoCards[]` are rendered as React elements, not as separate IO block instances — they do not get automatic `blockClass` from the theme block id. Declaring `blockClass` on `list-context.info-card-list` applies the same modifiers to every card's CSS handles (shell, CTA, and Rich Text when `textMode: rich-text`). See [DEVELOPMENT_LOG.md §7](./DEVELOPMENT_LOG.md).

### List + slider composition

When `list-context.info-card-list` feeds cards into a layout block (e.g. `slider-layout`), CSS handles use the **layout app's namespace** (e.g. `sunhouse-slider-layout-0-x-infoCardContainer`). Each handle receives modifiers from **both** the layout's `blockClass` and the list's `blockClass` — so a single handle can carry modifiers from two different sources at once:

```
.infoCardContainer--banner            ← from slider-layout's blockClass
.infoCardContainer--banner-main       ← from slider-layout's blockClass
.infoCardContainer--main-banner       ← from the list's blockClass
.infoCardContainer--main-banner-home  ← from the list's blockClass
```

In other words, given:

| Source | Example `blockClass` | Generated modifiers |
| ------ | --------------------- | -------------------- |
| `slider-layout` | `["banner", "banner-main"]` | `--banner`, `--banner-main` |
| `list-context.info-card-list` | `["main-banner", "main-banner-home"]` | `--main-banner`, `--main-banner-home` |

...every card's handle ends up carrying all four modifiers, letting theme CSS target either the layout or the content independently:

```css
/* styles/css/.../sunhouse.slider-layout.css */
.heading--main-banner-home {
  /* styles ported from vtex.store-components.css */
}
```

When `textMode` is `"rich-text"`, text fields also expose Rich Text handles (`container`, `wrapper`, `heading`, `paragraph`, `headingLevel1`, …) with the same combined modifiers. With `textMode: "html"` (default), text uses Info Card shell handles (`infoCardHeadline`, `infoCardSubhead`, `infoCardBodyText`).

### Backdrop overlay (`hasBackdrop`)

When `hasBackdrop` is `true` and `isFullModeStyle` is `true`, the app adds a `--backdrop` modifier on `infoCardContainer` only. The overlay appearance is defined in the **store theme** — the app does not ship CSS.

```css
/* styles/css/.../sunhouse.slider-layout.css */
.infoCardContainer--backdrop {
  position: relative;
}

.infoCardContainer--backdrop::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}

.infoCardContainer--backdrop .infoCardTextContainer {
  position: relative;
  z-index: 1;
}
```

Per-banner toggle in `infoCards[]`:

```json
{
  "isFullModeStyle": true,
  "hasBackdrop": true,
  "headline": "Banner with overlay",
  "imageUrl": "https://..."
}
```

> Do not use list-level `blockClass` (e.g. `--main-banner-home::after`) for per-banner overlays — that modifier applies to every card in the list. Use `hasBackdrop` instead.

### Seasonal banners (`isHidden`)

When `isHidden` is `true`, the banner is **not rendered in the DOM** — no container, no image, no slider slide. The item stays in `infoCards[]` so merchants can toggle visibility in Site Editor without re-entering copy or media.

```json
{
  "headline": "Christmas Sale",
  "isFullModeStyle": true,
  "imageUrl": "https://...",
  "isHidden": true
}
```

**How it works:**

| Layer | Behavior |
| ----- | -------- |
| `infoCardsAsList.js` | Filters hidden items before building JSX (list + `slider-layout`) |
| `InfoCard` (standalone) | Returns `null` when `isHidden` is `true` |
| Default | `false` — backward compatible |

> Prefer `isHidden` over CSS `display: none` — hidden banners do not load images and do not leave empty slides in the carousel.

---

## Differences from `vtex.store-components`

| Aspect | `vtex.store-components` | `sunhouse.info-card-custom` |
| ------ | ------------------------- | ----------------------------- |
| Block name | `info-card` | `info-card-custom` |
| Scope | ~20 store blocks | Info Card only |
| List of cards | Not built-in | `list-context.info-card-list` |
| `textMode` default | `html` | `html` (aligned) |
| `blockClass` on lists | N/A | List-level prop; inherited by all `infoCards[]` items |
| `hasBackdrop` | N/A | Per-banner overlay toggle; adds `--backdrop` on `infoCardContainer` (full mode only) |
| `isHidden` | N/A | Per-banner visibility toggle; skips DOM render while keeping `infoCards[]` config |
| `blockClass` in slider | Native block context applies automatically | Manual propagation via `cssHandlesWithBlockClass` + `InfoCardRichText` |

---

## References

- [VTEX Store Components — InfoCard](https://developers.vtex.com/docs/apps/vtex.store-components)
- [VTEX Store Image — list-context.image-list](https://developers.vtex.com/docs/apps/vtex.store-image)
- [Development log](./DEVELOPMENT_LOG.md)
