export default ({ app }) => {
    var redirect = app.$auth.$storage.options.redirect
    var localeChunk = (app.i18n.defaultLocale == app.i18n.locale) ? '' : ('/' + app.i18n.locale)
    for (var key in redirect) {
        redirect[key] = (localeChunk + redirect[key])
    }
    app.$auth.$storage.options.redirect = redirect
}