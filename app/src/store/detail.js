import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api';
// 生成一个游客的临时身份id
import { getUUID } from '@/utils/uuid_token';
const state = {
  goodInfo: {},
  // 游客临时身份id
  uuid_token: getUUID(),
};
const mutations = {
  GETGOODINFO(state, goodInfo) {
    state.goodInfo = goodInfo;
  },
};
const actions = {
  // 获取商品信息
  async getGoodInfo({ commit }, skuId) {
    let result = await reqGoodsInfo(skuId);
    if (result.code == 200) {
      commit('GETGOODINFO', result.data);
    }
  },
  // 添加购物车
  async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
    // 加入购物车返回的结果：服务器仅返回请求成功还是失败，没有数据
    let result = await reqAddOrUpdateShopCart(skuId, skuNum);
    // 当前的函数，执行后返回的是 Promise
    // 加入购物车成功
    if (result.code == 200) {
      return 'ok';
    } else {
      return Promise.reject(new Error('fail'));
    }
  },
};
const getters = {
  // 路径导航简化
  categoryView(state) {
    // 如果服务器中的数据还未返回，state.goodInfo为空对象，就会报错
    return state.goodInfo.categoryView || {};
  },
  // 商品信息简化
  skuInfo(state) {
    return state.goodInfo.skuInfo || {};
  },
  // 商品属性简化
  spuSaleAttrList(state) {
    return state.goodInfo.spuSaleAttrList || [];
  },
};
export default {
  state,
  mutations,
  actions,
  getters,
};
