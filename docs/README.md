# Info Card Custom

Standalone VTEX IO app based on the [`info-card`](https://developers.vtex.com/docs/apps/vtex.store-components) block from `vtex.store-components`. It ships the Info Card as an independent app under the `sunhouse` vendor namespace, with a list wrapper compatible with VTEX `list-context` composition (same pattern as [`vtex.store-image`](https://developers.vtex.com/docs/apps/vtex.store-image)).

![image](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-store-components-infocard-0.png)

**App identity:** `sunhouse.info-card-custom`

For implementation history, QA status, and pending work, see [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md).

---

## Blocks

| Block | Description |
| ----- | ----------- |
| `info-card-standalone` | Single Info Card with text, image, and optional call-to-action |
| `list-context.info-card-list` | Array of Info Cards (`infoCards` prop) with optional `children` for layout composition (e.g. `slider-layout`) |

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

If you use `list-context.info-card-list` with a slider, also declare the layout app (e.g. `vtex.slider-layout`).

### 2. Single Info Card

Add `info-card-standalone` to the desired template and configure its props:

```json
{
  "info-card-standalone#example": {
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

### 3. Info Card list (direct render)

When `children` is omitted, all items in `infoCards` are rendered sequentially on the page:

```json
{
  "list-context.info-card-list#home-banners": {
    "props": {
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

### 4. Info Card list with layout children

When `children` is declared, the list is passed to the child block via `vtex.list-context` (e.g. one card per slide):

```json
{
  "list-context.info-card-list#slider": {
    "children": ["slider-layout#info-cards"],
    "props": {
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

Each object inside `infoCards` accepts the same props as `info-card-standalone`.

---

## Props

Applies to `info-card-standalone` and to each item in `list-context.info-card-list` → `infoCards`.

| Prop name | Type | Description | Default value | Site Editor |
| --------- | ---- | ----------- | ------------- | ----------- |
| `blockClass` | `string` | Extra class name for custom styling | — | ✅ |
| `htmlId` | `string` | ID of the container element | — | ❌ |
| `isFullModeStyle` | `boolean` | If `true`, image is used as background and text is displayed over it | `false` | ✅ |
| `textMode` | `TextModeEnum` | How `headline`, `subhead`, and `bodyText` are processed | `"html"` | ✅ |
| `headline` | `string` | Headline of the Info Card | `""` | ✅ |
| `subhead` | `string` | Text underneath the headline | `""` | ✅ |
| `bodyText` | `string` | Text underneath the subhead | `""` | ✅ |
| `textPosition` | `TextPositionEnum` | Position of the text: `left`, `center`, or `right` | `"left"` | ✅ |
| `textAlignment` | `TextAlignmentEnum` | Text alignment inside the component. Ignored when `isFullModeStyle` is `true` | `"left"` | ✅ |
| `imageUrl` | `string` | Image URL for desktop | `""` | ✅ |
| `mobileImageUrl` | `string` | Image URL for mobile. Falls back to `imageUrl` when empty | `""` | ✅ |
| `imageAltText` | `string` | Alternative text for the image (SEO) | `""` | ❌ |
| `imageActionUrl` | `string` | URL when the image is clicked | `""` | ✅ |
| `linkTarget` | `LinkTargetEnum` | Target when the Info Card wrapper link is used | `"_self"` | ❌ |
| `callToActionMode` | `CallToActionEnum` | CTA display mode | `"button"` | ✅ |
| `callToActionText` | `string` | CTA label | `""` | ✅ |
| `callToActionUrl` | `string` | CTA URL | `""` | ✅ |
| `callToActionLinkTarget` | `LinkTargetEnum` | Target for the CTA link | `"_self"` | ⚠️ `_self` / `_blank` only |
| `fetchpriority` | `string` | Image fetch priority hint: `high`, `low`, or `auto` | `"auto"` | ❌ |
| `preload` | `boolean` | Preloads the image, prioritizing display over other assets | `false` | ❌ |

Props marked ❌ work via `blocks.json` but are not exposed in the Site Editor yet.

### `list-context.info-card-list` props

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `infoCards` | `array` | Array of Info Card configuration objects (same props as above) |
| `children` | blocks | Optional. Layout blocks that consume the list via `vtex.list-context`. When omitted, cards render directly |

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

| Enum name | Enum value | Description |
| --------- | ----------- | ----------- |
| HTML | `html` | Uses sanitized HTML for `headline`, `subhead`, and `bodyText` |
| Rich Text | `rich-text` | Uses markdown via [`vtex.rich-text`](https://github.com/vtex-apps/rich-text) |

---

## Customization

To apply CSS customizations, see the [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization) guide.

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

---

## Differences from `vtex.store-components`

| Aspect | `vtex.store-components` | `sunhouse.info-card-custom` |
| ------ | ------------------------- | ----------------------------- |
| Block name | `info-card` | `info-card-standalone` |
| Scope | ~20 store blocks | Info Card only |
| List of cards | Not built-in | `list-context.info-card-list` |
| `textMode` default | `html` | `html` (aligned) |

---

## References

- [VTEX Store Components — InfoCard](https://developers.vtex.com/docs/apps/vtex.store-components)
- [VTEX Store Image — list-context.image-list](https://developers.vtex.com/docs/apps/vtex.store-image)
- [Development log](./DEVELOPMENT_LOG.md)
