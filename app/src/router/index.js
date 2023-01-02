import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
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

let router = new VueRouter({
  // 配置路由
  routes,
  // 配置路由跳转时，滚动条的位置
  scrollBehavior(to, from, savedPosition) {
    return { y: 0 };
  },
});

// 全局前置守卫，在路由跳转之前进行判断
router.beforeEach(async (to, from, next) => {
  // to：跳转到哪个路由
  // from：从哪个路由跳转过去的
  // next：放行路由的函数
  // next('/login') --- 放行到 login 路由
  next();
  // 仓库中的 token
  let token = store.state.user.token;
  // 用户信息
  let name = store.state.user.userInfo.name;
  // 用户已经登录
  if (token) {
    // 不能再跳转至登录页面
    if (to.path == '/login') {
      next('/home');
    } else {
      // 登录了，但是去的不是登录路由
      if (name) {
        next();
      } else {
        try {
          // 没有用户信息
          await store.dispatch('getUserInfo');
          next();
        } catch (error) {
          // token 失效了，获取不到用户的信息，重新登录
          // 清除 token
          await store.dispatch('userLogout');
          next('/login');
        }
      }
    }
  } else {
    // 未登录
    let toPath = to.path;
    if (
      toPath.indexOf('/trade') != -1 ||
      toPath.indexOf('/pay') != -1 ||
      toPath.indexOf('/center') != -1
    ) {
      next(`/login?redirect=${toPath}`);
    } else {
      next();
    }
  }
});

export default router;
