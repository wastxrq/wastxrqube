import { loadJson } from '@/lib/storage'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import uk from '@/locales/uk.json'
import { createI18n } from 'vue-i18n'
import { LOCAL_STORAGE_KEYS } from './constants'

export type Locale = 'uk' | 'en' | 'es'

const i18n = createI18n({
  legacy: false,
  locale: loadJson<Locale>(LOCAL_STORAGE_KEYS.LOCALE_STORAGE_KEY, 'en'),
  fallbackLocale: 'en',
  messages: { uk, en, es },
})

export default i18n
