// 登录与注册模块
import {
  reqGetCode,
  reqUserRegister,
  reqUserLogin,
  reqUserInfo,
  reqLogout,
} from '@/api';
import { setToken, getToken, removeToken } from '@/utils/token';

const state = {
  code: '',
  token: getToken(),
  userInfo: {},
};
const mutations = {
  GETCODE(state, code) {
    state.code = code;
  },
  USERLOGIN(state, token) {
    state.token = token;
  },
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  // 清除本地数据
  CLEAR(state) {
    state.token = '';
    state.userInfo = {};
    removeToken();
  },
};
const actions = {
  // 获取验证码
  async getCode({ commit }, phone) {
    let result = await reqGetCode(phone);
    if (result.code == 200) {
      commit('GETCODE', result.data);
      return 'ok';
    } else {
      return Promise.reject(new Error('file'));
    }
  },
  // 用户注册
  async userRegister({ commit }, user) {
    let result = await reqUserRegister(user);
    if (result.code == 200) {
      return 'ok';
    } else {
      return Promise.reject(new Error('file'));
    }
  },
  // 用户登录
  async userLogin({ commit }, data) {
    let result = await reqUserLogin(data);
    // 服务器下发 token，用户的唯一标识符
    // 通过 token， 向服务器要数据
    if (result.code == 200) {
      commit('USERLOGIN', result.data.token);
      // 持久化存储token
      setToken(result.data.token);
      return 'ok';
    } else {
      return Promise.reject(new Error('file'));
    }
  },
  // 登录成功后，获取用户数据
  async getUserInfo({ commit }) {
    let result = await reqUserInfo();
    if (result.code == 200) {
      // 提交用户信息
      commit('GETUSERINFO', result.data);
      return 'ok';
    } else {
      return Promise.reject(new Error('file'));
    }
  },
  // 退出登录
  async userLogout({ commit }) {
    // 向服务器发送请求，清除 token
    let result = await reqLogout();
    // action 中不能操作 state
    if (result.code == 200) {
      commit('CLEAR');
      return 'ok';
    } else {
      return Promise.reject(new Error('file'));
    }
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
