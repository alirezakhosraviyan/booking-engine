import {AMENITIES, CITIES, PAYMENT_METHODS, BOOKING_ENGINE_CONFIG, ENGINE_CLUB_AUTH} from "~/api"

import getMainImages from '~/util/functions/get-main-images.js'

import dev from '~/util/options/dev'

export const state = () => ({
  inventories: {
    amenities: [],
    cities: [],
    paymentMethods: [],
  },
  colors: {
    primary:   '#F0F0F0',
    accent:    '#F0F0F0',
    secondary: '#F0F0F0',
    info:      '#F0F0F0',
    warning:   '#F0F0F0',
    error:     '#F0F0F0',
    success:   '#F0F0F0',
  },
  info: {},
  images: {
    main: [],
    other: [],
  },
  hotelsDic: {},
  pwaPromptSeen: false,
  offsetTop: 0,
});

export const getters = {
  amenitiesDic: state => {
    return state.inventories.amenities.reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})
  },
  citiesDic: state => {
    return state.inventories.cities.reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})
  },
  paymentMethodsDic: state => {
    return state.inventories.paymentMethods.reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})
  },
};

export const mutations = {
  setInventory(state, { type, data }) {
    state.inventories[type].splice(
      0,
      state.inventories[type].length,
      ...data
    )
  },
  setColors(state, data) {
    state.colors.primary = data?.primary
    state.colors.accent = data?.accent
    state.colors.secondary = data?.secondary
    state.colors.info = data?.info
    state.colors.warning = data?.warning
    state.colors.error = data?.error
    state.colors.success = data?.success
  },
  setInfo(state, data) {
    for(let key of Object.keys(data))
      state.info[key] = data[key]
  },
  setImages(state, { hotels }) {
    for(let hotel of hotels) {
      for(let image of hotel.images) {
        if(image.caption === 'main')
          state.images.main.push(image)
        else
          state.images.other.push(image)
      }
    }
  },
  setRooms(state, { hotels }) {
    state.hotelsDic = {}
    for(let { room_types, images, ...hotel } of hotels) {
      let { english_name, name, desc, english_desc, city, ...rest } = hotel
      state.hotelsDic[hotel._id] = {
        info: {
          hotel: {
            desc: { fa: desc || '', en: english_desc || '' },
            name: { fa: name || '', en: english_name || '' },
            city: { fa: city?.persian_name || '', en: city?.name || '' },
            ...rest
          },
          images: getMainImages(images)
        },
        rooms: {}
      }
      for(let room of room_types) {
        state.hotelsDic[hotel._id].rooms[room._id] = {
          amenities: room.amenities,
          _id: room._id,
          title: {
            fa: room.title,
            en: room.english_title
          },
          images: getMainImages(room.images),
        }
      }
    }
  },
  setPwaPrompt(state, d) {
    state.pwaPromptSeen = d;
  },
  setOffsetTop(state, data) {
    state.offsetTop = data;
  },
};

export const actions = {
  async getInventories({ commit }, { $api }) {
    const inventoryList = [
      { do: false , name: 'amenities'       , value: 'amenities'       , route: AMENITIES       },
      { do: false , name: 'cities'          , value: 'cities'          , route: CITIES          },
      { do: false , name: 'paymentMethods'  , value: 'payment_methods' , route: PAYMENT_METHODS },
    ]
    try {
      let responses = await Promise.allSettled(inventoryList.filter(i => i.do).map((item) => $api.get(item.route)))
      for(let i in responses) {
        if ((responses[i].status == 'fulfilled') && responses[i]?.value?.data?.[inventoryList[i].value]) {
          commit('setInventory', {
            data: responses[i].value.data?.[inventoryList[i].value],
            type: inventoryList[i].name
          })
        }
      }
    } catch (e) {}
  },
  async getConfig({ commit }, { $api, hostname }) {
    try {
      let { data } = await $api.get(BOOKING_ENGINE_CONFIG, { params: { hostName: hostname } })
      let { colors, hotels, id, title, description, chain, email, website, terms, notes, authStrategy, meta, ..._ } = data;
      commit('setInfo', {
        id,
        title,
        description,
        chain,
        hostName: hostname,
        email,
        website,
        terms,
        notes,
        authStrategy,
        meta,
        logo: meta?.logoUrl,
      });
      commit('setColors', { ...colors })
      commit('setImages', { hotels })
      commit('setRooms', { hotels })
    } catch (e) {}
  },
  async initClub({ state, commit }, { $api, query }) {
    let { hostName, authStrategy } = state.info
    if(authStrategy?.type !== 'NoAuth') {
      if(authStrategy.param) {
        if(query[authStrategy.param]) {
          try {
            let { data } = await $api.post(
              ENGINE_CLUB_AUTH,
              { token: query[authStrategy.param] },
              { params: { hostName } }
            )
            let { apiKey, userInfo } = data
            commit('club/setUser', userInfo)
            commit('club/setToken', apiKey)
            commit('club/setActive', true)
            commit('club/setKey', query[authStrategy.param])
            if(userInfo.credit) commit('club/setCredit', userInfo.credit)
          } catch (error) {}
        }
      }
    }
  },
  async refreshConfig({ state, dispatch }, _) {
    try {
      await dispatch('getConfig', { $api: this.$api, hostname: state?.info?.hostName })
    } catch (error) {}
  },
  async nuxtServerInit({ dispatch }, { $api, req, query }) {
    try {
      let hostname = dev ? 'engine.lamasoo.com' : req.headers.host;
      await dispatch('getConfig', { $api, hostname })
      await dispatch('initClub', { $api, query })
    } catch (e) {}
  }
};
