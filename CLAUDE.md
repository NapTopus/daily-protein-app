# CLAUDE.md

## 樣式規範

優先使用 UnoCSS class 撰寫樣式，而非在 `<style>` 區塊寫 CSS。

- 元件樣式應盡量以 UnoCSS atomic class 表達（顏色、間距、排版、flex/grid、響應式等）。
- 自訂顏色與 shortcuts 已定義於 [uno.config.ts](uno.config.ts)，需要時擴充該檔案而非寫死在 `<style>`。
- 僅在 UnoCSS 無法表達時才使用 `<style scoped>`，例如：
  - 複雜的 keyframes 動畫
  - 偽元素（`::before` / `::after`）的進階組合
  - `:deep()` 穿透 Ionic shadow DOM 的覆寫
  - SVG 內嵌、漸層 mask 等需要原生 CSS 語法的場景
- 若同一段樣式在多處重複，優先抽成 UnoCSS shortcut，而非複製貼上 class 串。

## 設計規範

撰寫或修改 UI 元件時，遵循 `.claude/commands/frontend-design.md` 中定義的設計原則，涵蓋視覺層級、排版、色彩對比、空間節奏與互動回饋。
