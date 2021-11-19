export const isRtl = (c, i18n) => i18n.locales.find((f) => (f.code == c))?.rtl

export default ({ $vuetify, app: { i18n } }) => {
  i18n.onLanguageSwitched = (from, to) => {
    $vuetify.rtl = isRtl(to, i18n)
    $vuetify.lang.current = to
    i18n.setLocaleCookie(to)
  }
}
