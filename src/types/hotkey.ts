export interface UseDeleteHotkeyOptions {
  /** Whether the hotkey should currently act, e.g. not mid-solve and something exists to delete. */
  enabled: () => boolean
  onDelete: () => void
}
