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

// 获取商品详情信息
// 请求地址 /api/item/{ skuId }
export const reqGoodsInfo = (skuId) =>
  requests({ url: `/item/${skuId}`, method: 'get' });

// 将商品添加到购物车
// /api/cart/addToCart/{ skuId }/{ skuNum } post
export const reqAddOrUpdateShopCart = (skuId, skuNum) =>
  requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' });

// 获取购物车数据
// /api/cart/cartList  get
export const reqCartList = () =>
  requests({ url: '/cart/cartList', method: 'get' });

// 删除购物车的商品
// /api/cart/deleteCart/{skuId}
export const reqDeleteCartById = (skuId) =>
  requests({ url: `/cart/deleteCart/${skuId}`, method: 'delete' });

// 修改购物车商品的选中状态
// /api/cart/checkCart/{skuId}/{isChecked}  get
export const reqUpdateCheckedById = (skuId, isChecked) =>
  requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'get' });

// 获取注册验证码
// /api/user/passport/sendCode/phone get
export const reqGetCode = (phone) =>
  requests({ url: `/user/passport/sendCode/${phone}`, method: 'get' });

// 注册的接口
// /api/user/passport/register  post
export const reqUserRegister = (data) =>
  requests({ url: '/user/passport/register', data, method: 'post' });

// 登录
// /api/user/passport/login post
export const reqUserLogin = (data) =>
  requests({ url: `/user/passport/login`, data, method: 'post' });

// 获取用户的信息，需要携带用户的 token
// /api/user/passport/auth/getUserInfo  get
export const reqUserInfo = () =>
  requests({ url: '/user/passport/auth/getUserInfo', method: 'get' });

// 退出登录
// /api/user/passport/logout   gets
export const reqLogout = () =>
  requests({ url: `/user/passport/logout`, method: 'get' });

// 获取用户地址信息
// URL: /api/user/userAddress/auth/findUserAddressList      get
export const reqAddressInfo = () =>
  requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method: 'get',
  });

// 获取商品结算清单
// /api/order/auth/trade    get
export const reqOrderInfo = () =>
  requests({ url: '/order/auth/trade', method: 'get' });

// 提交订单
// /api/order/auth/submitOrder?tradeNo={tradeNo}      post
export const reqSubmitOrder = (tradeNo, data) =>
  requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
    method: 'post',
  });

// 获取支付信息
// /api/payment/weixin/createNative/{orderId}       get
export const reqPayInfo = (orderId) =>
  requests({ url: `/payment/weixin/createNative/${orderId}`, method: 'get' });

// 获取支付订单状态
// /api/payment/weixin/queryPayStatus/{orderId}     get
export const reqPayStatus = (orderId) =>
  requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get' });

// 获取个人中心
// /api/order/auth/{page}/{limit}      get
export const reqMyOrderList = (page, limit) =>
  requests({ url: `/order/auth/${page}/${limit} `, method: 'get' });
