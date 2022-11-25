// 当前模块：API进行统一管理
import requests from './ajax';
import mockRequests from './mockAjax';

// 三级联动接口
// /api/product/getBaseCategoryList
// 发请求：axios 发请求的结果是 Promise 对象
export const reqCategoryList = () =>
  requests({ url: '/product/getBaseCategoryList', method: 'get' });

export const reqBannerList = () =>
  mockRequests({ url: '/banner', methods: 'get' });

// 获取 floor 数据
export const reqFloorList = () =>
  mockRequests({ url: '/floor', method: 'get' });

// 获取搜索模块数据 地址：/api/list，请求方式 post
// 参数：
// {
//   "category3Id": "61",
//   "categoryName": "手机",
//   "keyword": "小米",
//   "order": "1:desc",
//   "pageNo": 1,
//   "pageSize": 10,
//   "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
//   "trademark": "4:小米"
// }

export const reqGetSearchInfo = (params) =>
  requests({ url: '/list', method: 'post', data: params });
