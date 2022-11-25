import { reqCategoryList, reqBannerList, reqFloorList } from '@/api';
// home 模块的仓库
const state = {
  categoryList: [],
  bannerList: [],
  floorList: [],
};
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList;
  },
  BANNERLIST(state, bannerList) {
    state.bannerList = bannerList;
  },
  GETFLOORLIST(state, floorList) {
    state.floorList = floorList;
  },
};
const actions = {
  // 向服务器发送请求，获取数据
  async getCategoryList({ commit }) {
    let result = await reqCategoryList();
    if (result.code == 200) {
      commit('CATEGORYLIST', result.data);
    }
  },
  async getBannerList({ commit }) {
    let result = await reqBannerList();
    if (result.code == 200) {
      commit('BANNERLIST', result.data);
    }
  },
  // 获取floor数据
  async getFloorList({ commit }) {
    let result = await reqFloorList();
    if (result.code == 200) {
      // 提交mutations
      commit('GETFLOORLIST', result.data);
    }
  },
};
// 计算属性
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
