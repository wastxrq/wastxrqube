## Principles

- Clarity and consistency over cleverness. Minimal changes. Match existing patterns.
- Keep components/functions short; break down when it improves structure.
- TypeScript everywhere; no `any` unless isolated and necessary.
- No unnecessary `try/catch`. Avoid casting; use narrowing.
- Absolute imports via `@/` unless same directory.
- Follow existing ESLint setup; don't reformat unrelated code.
- Let compiler infer return types unless annotation adds clarity.
- Options object for 3+ params, optional flags, or ambiguous args.
- Hypothesis-driven debugging: 1–3 causes, validate the most likely one first —
  and validate against _actual computed/rendered state_ (devtools computed
  styles, a probe script), not just by re-reading the source a second time.
  If a fix doesn't visibly resolve the symptom, diagnose before trying a second
  fix — don't stack guesses.
- When reporting that a visual/geometric bug is fixed, verify by extracting and
  quoting the actual rendered values (SVG coordinates, computed styles, DOM
  attributes) — not a prose description of what the code does. A prose
  description of coordinates has mislabeled which point is which more than
  once while the underlying numbers were fine (or not) — always show the raw
  numbers being compared, and state the comparison result explicitly (e.g.
  "x1=122, x2=122, so this IS a side, not a diagonal"), rather than asserting
  the conclusion alone.
- Before editing any file, read its current content — don't edit from memory
  of what a prior turn wrote.
- Whenever a piece of data's correctness can be checked computationally
  (a cube algorithm, a generated layout, a derived mapping), write a small
  validation script and run it rather than trusting recollection or a source
  document at face value. This project has repeatedly caught real bugs this
  way (wrong move notation, a missing rotation, duplicate case states) —
  treat any unvalidated algorithm/data as provisional until checked.

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check + build
- `npm run lint` — ESLint
- `npm run type-check` — vue-tsc --noEmit
- `npm run format` — Prettier write
- `npm run check` — type-check + lint + format:check

## Environment Variables

Never read `import.meta.env` directly outside of a single, dedicated config
module. If the project doesn't have one yet, add `src/env.ts` and route all
env access through it.

## Architecture

### Data Flow

Component (`<script setup>`) → composable (`src/composables/`) for reusable
reactive logic → Pinia store (`src/stores/`) for persisted/shared state, or a
plain module (`src/cube/`, `src/lib/`) for pure computation with no reactive
state of its own.

- Presentational components (`CaseCard`, `CollapsiblePanel`, `AppButton`,
  `*Diagram.vue`) never import a store directly — props and emits only.
- Views (`src/views/*View.vue`) own store access and composition; they wire
  stores + composables + presentational components together.
- Pure logic (cube simulation, stats math, formatting) lives in plain `.ts`
  modules with no Vue imports at all — testable without mounting anything.

### State

- Pinia — persisted and cross-component state (sessions, practice history,
  selected cases). Setup-store style (`defineStore('name', () => {...})`),
  not the options-object style.
- `ref`/`reactive` — local UI-only state (open/closed, hover, form inputs).
- `computed` — all derived data. Never duplicate derived values into state
  that then needs manual syncing.
- vue-i18n — all user-facing strings.
- URL/route params — only if a value needs to be shareable/bookmarkable
  (this project currently has none; don't add route-param state speculatively).

### Page Pattern

Views compose store(s) + composable(s) + presentational components. Keep the
view's own `<script setup>` focused on wiring (computed derivations, event
handlers calling store actions) — push anything reusable (a hotkey guard, a
timer state machine, a validation routine) into `composables/` or `lib/`
rather than growing it inline in a view.

## TypeScript — FILE PLACEMENT

Centralized by domain, not colocated per-component:

- **Types**: `src/types/<domain>.ts` (e.g. `types/oll.ts`, `types/timer.ts`,
  `types/cube.ts`). Export via `export interface` / `export type`. A type used
  by both OLL and PLL practice (e.g. an attempt/history-entry shape) goes in
  the more general-purpose file and gets imported by both — don't duplicate
  a near-identical interface under two domain-specific names.
- **Constants**: `src/constants/<domain>.ts` (e.g. `constants/storage.ts` for
  every localStorage key, `constants/timer.ts` for thresholds like inspection
  duration or the recap "slow" multiplier). Any literal with actual meaning
  (a threshold, a limit, a storage key) belongs here — not pure layout/
  geometry math (e.g. SVG viewBox arithmetic), which stays inline as ordinary
  code.
- **Pure utilities**: `src/lib/<name>.ts` (e.g. `lib/stats.ts`, `lib/time.ts`,
  `lib/storage.ts`, `lib/pluralize.ts`). No Vue reactivity, no side effects
  beyond what the function name promises.
- **Composables**: `src/composables/use<Name>.ts`. Reusable _reactive_ logic
  (state machines, event-listener wiring). Unlike React hooks, composables
  have no rules-of-hooks restriction — conditional calls are fine.
- **Cube engine**: `src/cube/` — facelet simulation, scramble generation,
  case-diagram data derivation. No UI concerns here at all.
- **Static datasets**: `src/data/<name>.ts` (e.g. `data/oll.ts`, `data/pll.ts`,
  `data/f2l.ts`). Typed against `src/types/`. Any algorithm/case data added
  here must be validated per the Principles section before being treated as
  correct.

Named exports only in `.ts` files. `.vue` SFCs are the one necessary exception
(the SFC compiler produces the component as the file's default export) —
import them as `import Foo from './Foo.vue'`, no barrel re-export needed
unless the folder pattern below applies.

No type assertions (`as`) — use type guards or proper generics.

### Naming

- Types/unions: `T` prefix if it aids scanning, otherwise a plain descriptive
  name is fine (`Solve`, `TimerState`) — don't force a prefix onto something
  already unambiguous.
- Component props: typed inline via `defineProps<{...}>()` — no separate
  named `Props` type unless the shape is reused elsewhere.
- Composable return values: typed inline or via a small local type if the
  shape is only consumed by that composable's callers.
- Boolean props: `is`, `has`, `can`, `should` prefix.
- Props for event callbacks some consumers might pass: `on` prefix. Emits
  themselves (`defineEmits`) use plain verb/noun names (`close`, `refresh`),
  not `onClose` — that prefix belongs to the _listener_, not the emitted
  event name.
- Handler implementations: `handle` prefix (`handleClick`).

## Components

Folder structure for anything with more than one consumer, or with enough
internal complexity to warrant separation — a single flat `.vue` file is fine
for a view-level composition that nothing else imports:

```
ComponentName/
  ComponentName.vue
  index.ts        (barrel: export { default as ComponentName } from './ComponentName.vue')
```

Domain folders group related components (`components/OllTraining/`,
`components/Timer/`, `components/Modal/`) with one barrel `index.ts` per
folder.

Rules:

- `<script setup lang="ts">` everywhere — no Options API, don't mix styles
  within one file.
- Presentational components: props/slots in, emits out — no store imports,
  no side effects beyond what's declared in props/emits.
- Prefer props + emits over `defineExpose` for parent–child communication.
  Only reach for `defineExpose` when the parent genuinely needs to drive a
  child's internal state that can't reasonably be lifted to a prop (rare) —
  it's a last resort, not a shortcut around wiring a proper `v-model`/emit.
- `<style scoped>` stays with its component. Move CSS to a shared component
  only when the _same rules_ are genuinely duplicated in 2+ places — don't
  pre-extract just because two components look visually similar.

### When to extract a shared component

Extract reactively, once real duplication of **nontrivial** logic or markup
appears in two or more places — not preemptively, and not for simple wiring
code that merely looks repetitive on the surface. A shared accordion
(`CollapsiblePanel`) or a shared aspect-ratio card grid (`CaseCard`) earns
extraction because the _logic_ (open/close state, responsive grid math) is
genuinely identical and error-prone to keep in sync. Two ~100-line files that
each glue one store to one data module to one diagram component do **not**
automatically deserve a generic wrapper — that's straightforward wiring, and
forcing it through a shared abstraction (prop-drilling a store shape, a
dynamic `<component :is>`) adds more indirection than the duplication it
removes. If a third, genuinely similar consumer shows up later, that's the
right point to revisit — a third data point tells you the real shared shape
instead of guessing from two.

## Conditional Logic

Prefer object-literal lookups over if/else chains or switch statements:

```ts
// CORRECT
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}
const variantClass = computed(() => VARIANT_CLASSES[props.variant])

// WRONG
if (props.variant === 'primary') return 'btn-primary'
if (props.variant === 'ghost') return 'btn-ghost'
```

## Styling

Plain CSS with a custom-property token system — no Tailwind or CSS-in-JS.
All tokens live in `src/assets/main.css`'s `:root` block: `--bg`, `--panel`,
`--panel-2`, `--border`, `--text`, `--muted`, `--accent`, `--accent-dim`,
`--amber`, `--danger`, the cube-sticker colors (`--c-U/D/F/B/R/L`, fixed
across themes), and font stacks (`--font-display`, `--font-body`,
`--font-mono`).

- Never hardcode a hex/rgb value inside a component's `<style scoped>` block.
  If an existing token fits, use it; if a genuinely new semantic color is
  needed, add it to `:root` (and its light-theme override) first — don't
  invent a scoped one-off.
- This app supports light and dark themes via a `[data-theme="light"]`
  attribute on `<html>`, with a second override block in `main.css`. Any new
  color token added to the dark block needs a corresponding light-mode value
  added at the same time — don't ship a token in only one palette.
- Respect `prefers-reduced-motion` — the project has a global rule zeroing
  `animation-duration`; new `transition-duration` rules (e.g. on a modal or
  dropdown) need to be covered by that same query too, since
  `transition-duration` isn't zeroed by an `animation-duration` rule alone.
- SVG diagrams (`CaseDiagram`-family components) size via the parent
  container (`width/height: 100%` on the SVG, no fixed pixel prop) — the
  consumer's wrapper controls the rendered size, not the component itself.

## i18n

- vue-i18n. `src/locales/uk.json` is the source of truth; always add new
  keys to `uk.json`, `en.json`, and `es.json` together — never leave a key
  translated in only one locale.
- Never hardcode user-facing strings — always `t('...')`.
- Exception: OLL/PLL/F2L case names (Sune, T Perm, Ja Perm, etc.) are
  universal speedcubing-community terms, never localized anywhere in the
  world, and stay as literal strings in `data/oll.ts` etc., untouched by i18n.

## Data Correctness

Any OLL/PLL/F2L algorithm added to `data/*.ts` must be validated
computationally before being trusted, regardless of how authoritative the
source looks:

- Apply the algorithm to a solved cube (via the `cubejs/lib/cube` import —
  not the package's main entry point, which crashes under Vite; see the
  comment in `cube/engine.ts` for why) and confirm it only disturbs the
  facelets it's supposed to (last layer only for OLL/PLL; the correct single
  slot for F2L), leaving everything else byte-identical to solved.
- For a whole-cube-rotation-containing algorithm (`y`/`x`/`z` mid-sequence),
  use `cube.upright()` before comparing — a rotated-but-otherwise-correct
  result will otherwise look like a false failure.
- For PLL/F2L specifically, also check that orientation (co/eo) stays zero
  everywhere — a permutation-only algorithm that secretly twists a piece is
  a real, previously-caught bug class, not a hypothetical.
- When validating a batch (e.g. all cases in a data file), also check for
  duplicate resulting states across different case IDs — two cases that
  produce the same facelet pattern is a real bug (caught in F2L: three pairs
  of picks turned out to be literally the same algorithm).

## Git Commits

Format: `type(scope): message` — lowercase, present tense, imperative mood.
Types: feat | fix | refactor | chore | docs | perf | style

## What NOT to Do

- Options API mixed with `<script setup>` in the same codebase — pick one
  (this project uses `<script setup>` everywhere)
- Business/store logic inside presentational components
- `any` type or `as` casting
- Types/constants declared inline instead of in `src/types/`/`src/constants/`
- `defineExpose` used to reach into a child's internals when a prop + emit
  would do the same job more explicitly
- Hardcoded hex/rgb color values anywhere outside `main.css`'s token blocks
- Adding a color token to only the dark or only the light theme block
- Hardcoded user-facing strings, or i18n keys added to only one locale
- Trusting a cube algorithm (from memory or a source) without running it
  through the validation routine above
- Duplicate localStorage key definitions — route all persistence through
  `lib/storage.ts`'s shared load/save helpers, keys defined once in
  `constants/storage.ts`
- Manual/imperative DOM manipulation (`document.getElementById(...).innerHTML =`)
  where Vue reactivity already handles it — if you're reaching for this,
  something is being fought instead of used
- Preemptively generalizing simple wiring code into a shared abstraction
  before a second concrete, nontrivial need for it actually exists
- Fixing a layout/visual bug by guessing a second CSS change when the first
  one didn't work — diagnose the actual computed cause first
