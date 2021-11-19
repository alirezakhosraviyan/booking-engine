import { fa, en } from 'vuetify/lib/locale';

import { LOGIN, AUTH_SELF } from "./api"

import dev from "./util/options/dev"

export default {
  /*
  Global page headers
  (https://go.nuxtjs.dev/config-head)
  */
  head: {
    __dangerouslyDisableSanitizers: ['script'],
    title: 'Welcome',
    titleTemplate: 'Booking Engine Service - %s',
    meta: [
      { charset: 'utf-8' },
      { name: 'mobile-web-app-capable'                , content: 'yes'     },
      { name: 'apple-mobile-web-app-capable'          , content: 'yes'     },
      { name: 'apple-mobile-web-app-status-bar-style' , content: 'default' },
      { name: 'viewport'                              , content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no' },
    ],
    script: [
      {
        hid: 'gtm-script1',
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-111111111-1',

      },
      {
        hid: 'hantana',
        defer: true,
        innerHTML: `!(function(d,w,u,t,s,i){
        w.addEventListener('readystatechange', function(){if(w.readyState==="interactive") i = document.documentElement.scrollTop});
        function ha(){
            s = w.createElement("script");
            d._hantanaSettings={tId:t,i:i};
            s.type = "text/javascript", s.async = !0, s.src = u + t;
            h = w.getElementsByTagName('head')[0];
            h.appendChild(s);
        }
        "complete"===w.readyState?ha():d.attachEvent?d.attachEvent("onload",ha):d.addEventListener("load",ha,!1);})(window,document,'https://hantana.org/widget/','618bc-d9e4d-61fe3-2fdf2',0);`,
        type: 'text/javascript',
      }
    ],
  },

  /*
  Global CSS
  (https://go.nuxtjs.dev/config-css)
  */
  css: [
    "~/assets/util",
    "~/assets/custom",
  ],

  /*
  Plugins to run before rendering page
  (https://go.nuxtjs.dev/config-plugins)
  */
  plugins: [
    { src: '~/plugins/i18n'         , ssr: true  },
    { src: '~/plugins/axios'        , ssr: true  },
    { src: '~/plugins/booking'      , ssr: true  },
    { src: '~/plugins/moment'       , ssr: true  },
    { src: '~/plugins/filters'      , ssr: true  },
    { src: '~/plugins/print'        , ssr: false },
    { src: '~/plugins/persist'      , ssr: false },
    { src: '~/plugins/clipboard'    , ssr: false },
    { src: '~/plugins/notification' , ssr: false },
    { src: '~/plugins/jsonld'       , ssr: true  },
  ],

  /*
  Modules for dev and build (recommended)
  (https://go.nuxtjs.dev/config-modules)
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build'
  ],

  /*
  Modules
  (https://go.nuxtjs.dev/config-modules)
  */
  modules: [
    'nuxt-i18n',
    'nuxt-leaflet',
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/gtm',
  ],

  /*
  Axios module configuration
  (https://go.nuxtjs.dev/config-axios)
  */
  axios: {},

  /*
  Vuetify module configuration
  (https://go.nuxtjs.dev/config-vuetify)
  */
  vuetify: {
    rtl: true,
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: false,
      icons: 'mdi'
    },
    theme: {
      dark: false,
      options: {
        customProperties: true,
        variations: true
      },
      themes: {
        light: {
          primary: '#F0F0F0',
          accent: '#F0F0F0',
          secondary: '#F0F0F0',
          info: '#F0F0F0',
          warning: '#F0F0F0',
          error: '#F0F0F0',
          success: '#F0F0F0',
        }
      }
    },
    lang: {
      locales: { fa, en },
      current: 'fa'
    }
  },

  /*
  i18n module for internationalization
  (https://i18n.nuxtjs.org)
  */
  i18n: {
    defaultLocale: 'fa',
    detectBrowserLanguage: false,
    seo: true,
    lazy: true,
    langDir: 'lang/',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.js',
        rtl: false,
      },
      {
        code: 'fa',
        iso: 'fa-IR',
        name: 'فارسی',
        file: 'fa.js',
        rtl: true,
        isCatchallLocale: true
      },
    ],
    vueI18n: {
      fallbackLocale: 'fa',
    },
  },

  /*
  Authentication module
  (https://auth.nuxtjs.org)
  */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login:  { method: 'post' , propertyName: 'token' , url: LOGIN     },
          logout: { method: 'get'  , propertyName: false   , url: AUTH_SELF },
          user:   { method: 'get'  , propertyName: false   , url: AUTH_SELF },
        },
        tokenType: 'Bearer',
        tokenRequired: true,
        autoFetchUser: true
      }
    },
    redirect: {
      login:    '/admin/login',
      logout:   '/admin/login',
      callback: '/admin/colors',
      home:     '/admin/colors',
    },
    plugins: ['@/plugins/redirect.js']
  },

  /*
  Google tag manager module
  (https://github.com/nuxt-community/gtm-module)
  */
  gtm: {
    id: 'GTM-N8G66X9',
    enabled: true,
    debug: dev,
    layer: 'dataLayer',
    variables: {},
    pageTracking: true,
    pageViewEventName: 'engine-page',
    autoInit: true,
    respectDoNotTrack: false,
    scriptDefer: true,
    crossOrigin: true,
    noscript: false,
  },

  /*
  Build Configuration
  (https://go.nuxtjs.dev/config-build)
  */
  build: {}
}
