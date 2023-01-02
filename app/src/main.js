import Vue from 'vue';
import App from './App.vue';
// 三级联动组件---全局组件
import TypeNav from '@/components/TypeNav';
import Carousle from '@/components/Carousle';
import Pagination from '@/components/Pagination';
import { MessageBox } from 'element-ui';
// 第一个参数：全局组件的名字 第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav);
Vue.component(Carousle.name, Carousle);
Vue.component(Pagination.name, Pagination);
// 注册 element-ui 组件
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// 引入路由
import router from '@/router';
// 引入仓库
import store from '@/store';
// 引入 mockServer.js
import '@/mock/mockServe';
// 引入swiper样式
import 'swiper/css/swiper.css';
// 同意接收api文件夹中全部的请求函数
// 统一引入
import * as API from '@/api';
// 引入插件
import VueLazyLoad from 'vue-lazyload';
import lazyLoadImg from '@/assets/images/lazyload.gif';
// 注册插件
Vue.use(VueLazyLoad, {
  // 懒加载的默认图
  loading: lazyLoadImg,
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  // 全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
  // 注册路由，组件身上会添加 $route、$router属性
  router,
  // 注册仓库，组件实例会添加 $store 属性
  store,
}).$mount('#app');
