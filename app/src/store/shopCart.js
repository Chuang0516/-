import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from '@/api';
const state = {
  cartList: [{}],
};
const mutations = {
  GETCARLIST(state, cartList) {
    state.cartList = cartList;
  },
};
const actions = {
  // 获取购物车数据
  async getCartList({ commit }) {
    let result = await reqCartList();
    if (result.code == 200) {
      if (result.data.length == 0) result.data = [{}];
      commit('GETCARLIST', result.data);
    }
  },
  // 删除购物车商品
  async deleteCartListById({ commit }, skuId) {
    let result = await reqDeleteCartById(skuId);
    if (result.code == 200) {
      return 'ok';
    } else {
      return Promise.reject(new Error('file'));
    }
  },
  // 修改购物车产品选中的状态
  async updateCheckedById({ commit }, { skuId, isChecked }) {
    let result = await reqUpdateCheckedById(skuId, isChecked);
    if (result.code == 200) {
      return 'ok';
    } else {
      return Promise.reject(new Error('file'));
    }
  },
  // 删除全部勾选的产品
  async deleteAllCheckedCart({ dispatch, getters }) {
    // context：小仓库，commit-提交mutations，getters-计算属性，dispation-派发action，state-仓库数据
    // 获取购物车中全部的商品（数组）
    let PromiseAll = [];
    getters.cartInfoList
      .filter((item) => item.isChecked == 1 || item.isChecked == true)
      .forEach((item) => {
        let promise = dispatch('deleteCartListById', item.skuId);
        PromiseAll.push(promise);
      });
    return Promise.all(PromiseAll);
  },
  // 修改全选状态
  updateAllCartIsChecked({ dispatch, state }, isChecked) {
    let promiseAll = [];
    state.cartList[0].cartInfoList.forEach((item) => {
      let promise = dispatch('updateCheckedById', {
        skuId: item.skuId,
        isChecked,
      });
      promiseAll.push(promise);
    });
    return Promise.all(promiseAll);
  },
};
const getters = {
  cartInfoList(state) {
    return state.cartList[0].cartInfoList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
