import Vue from 'vue';
import VueRouter from 'vue-router';
// 引入路由配置信息
import routes from './routes';
// 解决编程式路由导航重复点击报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

export default new VueRouter({
  // 配置路由
  routes,
  // 配置路由跳转时，滚动条的位置
  scrollBehavior(to, from, savedPosition) {
    return { y: 0 };
  },
});
