import { BASE_URL, KEY } from "~/api"

export default (ctx, inject) => {

  const api = ctx.$axios.create({
    headers: { Authorization: KEY }
  })

  api.setBaseURL(BASE_URL);

  inject('api', api)
  ctx.$api = api

}
