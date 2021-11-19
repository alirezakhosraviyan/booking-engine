import generateAvailLookup from "~/util/functions/generate-avail-lookup"
import moment from "moment-jalaali"

export const state = () => ({
    chosenRatePlan: 0,
    roomLookup: {},
    ratePlans: [],
    cart: [],
    hotel: '',
    loading: false,
    timestamp: new Date(0).toISOString(),
});

export const getters = {
    cartIsEmpty: (state) => (Object.values(state.cart).filter(i => (typeof i?.count == 'number')).length == 0),
    totalRooms: (state) => (Object.values(state.cart).filter(i => (typeof i?.count == 'number')).reduce((acc, curr) => (acc + curr.count), 0)),
    cartTotal: (state) => {
        return state.cart.reduce((acc, curr) => {
            acc += (state?.roomLookup?.[curr?.id]?.rates?.[state?.ratePlans?.[state.chosenRatePlan]?.id]?.price?.price_to_pay || 0) * (curr.count || 0)
            return acc
        }, 0)
    }
};

export const mutations = {
    setRatePlan(state, data) {
        state.chosenRatePlan = data
    },
    generateAvailLookup(state, data) {

        let { roomDict, ratePlans, hotelId } = generateAvailLookup(data);

        let now = new Date().toISOString();
        let then = state.timestamp;
        state.timestamp = now
        now = moment(now);
        then = moment(then);
        if(now.diff(then) > (12 * 60 * 60 * 1000)) {
            state.cart = [];
        }

        if((hotelId != state.hotel)) {
            state.cart = [];
        }

        state.hotel = hotelId;
        state.roomLookup = {}
        for(let i of Object.keys(roomDict)) {
            state.roomLookup[i] = roomDict[i]
        }
        state.ratePlans.splice(0, state.ratePlans.length, ...ratePlans);

    },
    setLoading(state, data) {
        state.loading = data
    },
    addToCart(state, roomId) {
        let idx = state.cart.findIndex(i => (i.id == roomId))
        if(idx >= 0)
            state.cart[idx].count += 1
        else
            state.cart.push({ count: 1, id: roomId })
    },
    removeFromCart(state, roomId) {

        let idx = state.cart.findIndex(i => (i.id == roomId))
        if(idx >= 0) {
            state.cart[idx].count -= 1
            if(state.cart[idx].count == 0) {
                state.cart.splice(idx, 1)
            }
        }
    },
    clearCart(state, _) {
        state.cart = []
    }
};