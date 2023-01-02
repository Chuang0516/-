// 对于 axios 进行二次封装
import axios from 'axios';
// 引入进度条
import nprogress from 'nprogress';
// 引入商品详情页面的仓库
import detailStore from '@/store/detail';
// 引入进度条样式
import 'nprogress/nprogress.css';
import store from '@/store';
// start：进度条开始 done：进度条结束

// 1、利用 axios 对象的方法 create ，创建一个 axios 实例
const request = axios.create({
  // 配置对象
  // 基础路径，发送请求，路径中会出现api
  baseURL: '/api',
  // 代表请求超时的时间为5s
  timeout: 5000,
});
// 请求拦截器：在发请求之前，请求拦截器会监测到，在请求发出之前调用
request.interceptors.request.use((config) => {
  // config：配置对象，对象里面有一个属性很重要，headers请求头
  // 获取临时用户的 uuid
  if (detailStore.state.uuid_token) {
    // 给请求头添加字段(userTempId) --- 由后台决定
    config.headers.userTempId = detailStore.state.uuid_token;
  }
  // 需要携带 token 带给服务器
  if (store.state.user.token) {
    config.headers.token = store.state.user.token;
  }
  // 进度条开始动
  nprogress.start();
  return config;
});
// 响应拦截器：
request.interceptors.response.use(
  (res) => {
    // 响应成功
    // 进度条结束
    nprogress.done();
    return res.data;
  },
  (error) => {
    // 响应失败
    return Promise.reject(new Error('faile'));
  }
);

// 对外导出
export default request;
