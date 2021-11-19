import Vue from 'vue'
import numeral from 'numeral'
import moment from 'moment-jalaali'

Vue.filter("formatDate", (date, from, to) => {
    if(!date)
        return ''
    else if(from)
        return moment(date,from).format(to) || ''
    else
        return moment(date).format(to) || ''
})

Vue.filter("thousandify", num => numeral(num).format('0,0'))