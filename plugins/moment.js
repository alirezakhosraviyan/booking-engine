import moment from 'moment-jalaali'

export default (ctx, inject) => {
  ctx.$moment = moment
  inject('moment', moment)
}