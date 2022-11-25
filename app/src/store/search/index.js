import { reqGetSearchInfo } from '@/api';
// search 模块的仓库
const state = {
  searchInfo: {},
};
const mutations = {
  GETSEARCHINFO(state, searchInfo) {
    state.searchInfo = searchInfo;
  },
};
const actions = {
  // 获取 search 数据
  async getSearchInfo({ commit }, params = {}) {
    let result = await reqGetSearchInfo(params);
    if (result.code == 200) {
      commit('GETSEARCHINFO', result.data);
    }
  },
};
// 计算属性：简化数据
const getters = {
  goodsList(state) {
    // 这样书写是有问题的
    return state.searchInfo.goodsList || [];
  },
  trademarkList(state) {
    return state.searchInfo.trademarkList;
  },
  attrsList(state) {
    return state.searchInfo.attrsList;
  },
};
export default {
  state,
  mutations,
  actions,
  getters,
};
