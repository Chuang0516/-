<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cartInfo, index) in cartInfoList" :key="cartInfo.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cartInfo.isChecked == 1"
              @change="updateChecked(cartInfo, $event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl">
            <div class="item-msg">{{ cartInfo.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cartInfo.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('minus', cartInfo)">-</a>
            <input autocomplete="off" type="number"
              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" minnum="1" class="itxt"
              v-model="cartInfo.skuNum" @change="handler('change', cartInfo, $event)">
            <a href="javascript:void(0)" class="plus" @click="handler('add', cartInfo)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cartInfo.skuPrice * cartInfo.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cartInfo)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked" :disabled="cartInfoList.length == 0"
          @change="chooseAllChange">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { debounce } from 'lodash'
export default {
  name: 'ShopCart',
  data() {
    return {
      skuNumChange: 0,
    }
  },
  computed: {
    ...mapGetters(['cartInfoList']),
    // 计算购买商品的总价
    totalPrice() {
      return this.cartInfoList.filter((item) => item.isChecked == 1).reduce((pre, item) => pre + item.cartPrice * item.skuNum, 0);
    },
    // 全部勾选
    isAllChecked() {
      return this.cartInfoList.every(item => item.isChecked == 1);
    },
  },
  methods: {
    getData() {
      this.$store.dispatch('getCartList');
    },
    // 全选和反选
    async chooseAllChange(event) {
      let isChecked = event.target.checked ? '1' : '0';
      // 让购物车所有商品的 isChecked 属性等于全选框的状态
      this.cartInfoList.forEach(item => {
        item.isChecked = isChecked;
      });
      // 派发 action
      await this.$store.dispatch('updateAllCartIsChecked', isChecked).catch((err) => {
        console.error(err);
      })
    },
    reqhandler: debounce(async function (skuId, skuNum) {
      this.skuNumChange = 0;
      await this.$store.dispatch('addOrUpdateShopCart', { skuId, skuNum });
    }, 600),
    // 修改购物车某商品的数量
    handler(type, cartInfo, event) {
      // type：为了区分是 + - 还是输入框
      // disNum：+（1） -（-1） 输入框（最终的值）
      // cartInfo：获取点击的是哪一个商品
      // 向服务器发请求，修改数量
      // flag 用于标记是否发送请求，以免资源浪费
      switch (type) {
        case 'add':
          if (cartInfo.skuNum >= 200) {
            alert('商品数量不能大于200！');
            return;
          } else {
            this.skuNumChange++;
            cartInfo.skuNum++;
          }
          break;
        case 'minus':
          if (cartInfo.skuNum <= 1) {
            alert('商品数量必须大于0！');
            return;
          } else {
            this.skuNumChange--;
            cartInfo.skuNum--;
          }
          break;
        case 'change':
          if (event.target.value === '') {
            event.target.value = 1;
            setTimeout(() => alert('商品数量必须大于0！'), 0);
            return;
          } else if (event.target.value > 200) {
            event.target.value = 200;
            setTimeout(() => alert('商品数量不能大于200！'), 0);
          }
          this.skuNumChange = event.target.value - cartInfo.skuNum;
          break;
      }
      this.reqhandler(cartInfo.skuId, this.skuNumChange);
    },
    // 删除某一个商品
    async deleteCartById(cartInfo) {
      await this.$store.dispatch('deleteCartListById', cartInfo.skuId);
      this.getData();
    },
    // 修改商品勾选状态
    updateChecked: debounce(async function (cartInfo, event) {
      // 获取当前商品的勾选状态
      let isChecked = event.target.checked ? 1 : 0;
      cartInfo.isChecked == 1 ? cartInfo.isChecked = 0 : cartInfo.isChecked = 1;
      await this.$store.dispatch('updateCheckedById', { skuId: cartInfo.skuId, isChecked }).catch((err) => {
        console.error(err);
      })
    }, 500),
    // 删除全部选中的产品
    async deleteAllCheckedCart() {
      // 派发 action
      await this.$store.dispatch('deleteAllCheckedCart').then(() => {
        this.getData();
      }).catch((err) => {
        console.error(err);
      })
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;

        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;

          }

          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>