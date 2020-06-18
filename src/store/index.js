import Vue from 'vue'
import Vuex from 'vuex'
import types from './TYPES';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bookDetail: {},
    book: [],
    // 是否显示底部选项卡
    showBottomSelect: true,
    // 底部选项卡激活
    activeSelect: 0, 

    loading: false,
    // 亮度模式
    isNight: false
  },
  getters: {

  },
  mutations: {
    [types.BOOK_DETAIL](state, payload) {
      state.bookDetail = payload.data
    },
    [types.BOOK](state, payload) {
      state.book = payload.data
    },
    [types.SHOW_BOTTOM_SELECT](state, payload) {
      state.showBottomSelect = payload.data
    },
    // 激活的导航
    [types.ACTIVE_SELECT](state, payload) {
      state.activeSelect = payload.data
      
    },
    // 目录
    [types.LOADING](state, payload) {
      state.loading = payload.data
    },
    [types.ISNIGHT](state, payload) {
      state.isNight = payload.data
    }
  },
  actions: {},
  modules: {}
})