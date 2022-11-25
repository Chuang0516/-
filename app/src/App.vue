<template>
  <div>
    <MyHeader></MyHeader>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 在Home、Search下显示，在登录、注册下隐藏 -->
    <MyFooter v-show="$route.meta.show"></MyFooter>
  </div>
</template>

<script>
import MyHeader from './components/Header';
import MyFooter from './components/Footer';
export default {
  name: 'app',
  components: { MyHeader, MyFooter },
  mounted() {
    // 通知 vuex 发送请求，获取数据，存储至仓库中
    this.$store.dispatch('getCategoryList');
  }
}
</script>

<style>

</style>
