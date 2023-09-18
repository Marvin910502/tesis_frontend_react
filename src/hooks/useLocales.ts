import { useTranslation } from 'react-i18next'
// @mui
import { enUS, esES } from '@mui/material/locale'
import { esES as desES, enUS as denUS } from '@mui/x-data-grid-pro'

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'Spanish',
    value: 'es',
    systemValue: esES,
    icon: '/icons/es.png',
    lang: 'es_ES',
    datagridValue: desES
  },
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/icons/en.png',
    lang: 'en_US',
    datagridValue: denUS
  }

]

export default function useLocales () {
  const { i18n, t: translate } = useTranslation()
  const langStorage = localStorage.getItem('i18nextLng')
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1]

  const handleChangeLanguage = (newlang: string) => {
    i18n.changeLanguage(newlang)
  }

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS
  }
}
