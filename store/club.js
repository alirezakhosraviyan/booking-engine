export const state = () => ({
    userInfo: {
        firstName: '',
        lastName: '',
        nationalCode: '',
        mobile: '',
    },
    totalCredit: 0,
    spentCredit: 0,
    hasCredit: false,
    token: '',
    key: '',
    isActive: false,
});

export const getters = {
    remainingCredit: (state) => state.totalCredit - state.spentCredit,
};

export const mutations = {
    setUser(state, data) {
        state.userInfo.firstName = data.firstName
        state.userInfo.lastName = data.lastName
        state.userInfo.nationalCode = data.nationalCode
        state.userInfo.mobile = data.mobile
    },
    setToken(state, token) {
        state.token = token
    },
    setKey(state, key) {
        state.key = key
    },
    setActive(state, val) {
        state.isActive = val
    },
    setCredit(state, { org, ordersSum }) {
        state.totalCredit = parseInt(org)
        state.spentCredit = parseInt(ordersSum)
        state.hasCredit = true
    }
};