import Vue from 'vue'

import TRANSLATE_ADMIN_ERROR from "~/util/translations/translate-admin-error.js"

import { BASE_URL } from "~/api"

export default ({ $axios }, inject) => {

  $axios.setBaseURL(BASE_URL);

  $axios.onRequest(config => {});

  $axios.onResponse(response => {
    if(['post', 'put', 'delete'].includes(response?.config?.method))
      if(process.client)
        Vue.notify({
          text: 'Operation Success',
          group: 'default',
          type: 'success',
          duration: 5000,
        })
  });

  $axios.onResponseError(error => {
    /* error.config , error.response */
    if(process.client)
    error?.response?.data?.message &&
    TRANSLATE_ADMIN_ERROR[error.response.data.message] &&
    Vue.notify({
        group: 'default',
        text: TRANSLATE_ADMIN_ERROR[error.response.data.message],
        type: 'error',
        duration: 5000,
      })
  });

}
