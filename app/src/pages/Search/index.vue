<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }} <i
                @click="removeCategoryName">×</i> </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }} <i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(':')[1] }} <i
                @click="removeTrademark">×</i>
            </li>
            <!-- 商品售卖属性面包屑 -->
            <li class="with-x" v-for="(attrValue, index) in searchParams.props" :key="index">{{ attrValue.split(':')[1]
            }} <i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne[0] }" @click="changeOrder('1')">
                  <a>综合<span v-show="isOne[0]"><i v-show="isOne[1]">↓</i><i v-show="!isOne[1]">↑</i></span></a>
                </li>
                <li :class="{ active: isTwo[0] }" @click="changeOrder('2')">
                  <a>价格<span v-show="isTwo[0]"><i v-show="isTwo[1]">↓</i><i v-show="!isTwo[1]">↑</i></span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good, index) in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`"><img :src="good.defaultImg" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" :title="good.title">{{
                        good.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total='total' :continues="5"
            @getPageNo="getPageNo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector';
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'Search',
  components: {
    SearchSelector,
  },
  data() {
    return {
      searchParams: {
        // 一级分类的 id
        category1Id: '',
        // 二级分类的 id
        category2Id: '',
        // 三级分类的 id
        category3Id: '',
        // 分类名字
        categoryName: '',
        // 关键字
        keyword: '',
        // 排序：初始综合降序
        order: '1:desc',
        // 分页器
        pageNo: 1,
        // 展示商品个数
        pageSize: 3,
        // 平台售卖属性操作带的参数
        props: [],
        // 品牌
        trademark: '',
      },
    };
  },
  beforeMount() {
    // es6语法，合并对象
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(['goodsList', 'trademarkList', 'attrsList']),
    // 商品的总数
    ...mapState({ total: state => state.search.searchInfo.total }),
    isOne() {
      let orderFlag = this.searchParams.order.split(':');
      let flag_1 = orderFlag[0] == 1;
      let flag_2 = orderFlag[1] == 'desc';
      return [flag_1, flag_2];
    },
    isTwo() {
      let orderFlag = this.searchParams.order.split(':');
      let flag_1 = orderFlag[0] == 2;
      let flag_2 = orderFlag[1] == 'desc';
      return [flag_1, flag_2];
    }
  },
  methods: {
    // 向服务器发送请求获取search模块数据（根据参数不同返回不同的数据）
    getData() {
      this.$store.dispatch('getSearchInfo', this.searchParams);
    },
    // 删除分类的名字
    removeCategoryName() {
      // 定义为 undefined，不把空数据带给服务器
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // 向服务器发送请求
      this.getData();
      // 地址栏也需要修改：进行路由跳转
      // 判断路径中是否含有 params 参数
      this.$router.push({ name: 'search', params: this.$route.params })
    },
    // 删除关键字
    removeKeyword() {
      // 将 keyword 置空
      this.searchParams.keyword = undefined;
      this.getData();
      // 通知 header 组件清除关键字
      this.$bus.$emit('clear');
      // 进行路由跳转
      this.$router.push({ name: 'search', query: this.$route.query })
    },
    // 自定义事件
    trademarkInfo(trademark) {
      // 整理品牌字段参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // 发送请求
      this.getData();
      // 面包屑导航展示
    },
    // 删除面包屑品牌
    removeTrademark() {
      // 将品牌信息置空
      this.searchParams.trademark = undefined;
      // 再发请求
      this.getData();
    },
    // 收集商品属性
    attrInfo(attr, attrValue) {
      // 商品属性的数组: ["属性ID:属性值:属性名"]
      // 整理参数格式
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 判断 props 中是否已经含有 prop
      if (!this.searchParams.props.some(item => item == prop)) {
        this.searchParams.props.push(prop);
        this.getData();
      }
    },
    // 删除售卖属性面包屑导航
    removeAttr(index) {
      // 整理参数
      this.searchParams.props.splice(index, 1);
      // 发送请求
      this.getData();
    },
    // 排序操作
    changeOrder(flag) {
      // flag 标记用户点击的是 综合 还是 价格
      let currentFlag = this.searchParams.order.split(':')[0];
      let currentSort = this.searchParams.order.split(':')[1];
      if (flag != currentFlag) {
        // 切换
        currentFlag = flag;
        // 切换之后默认降序
        currentSort = 'desc';
      } else {
        // 判断当前的排序方式是升序还是降序
        currentSort = currentSort === 'desc' ? 'asc' : 'desc';
      }
      // 整理数据
      this.searchParams.order = `${currentFlag}:${currentSort}`;
      // 发送请求
      this.getData();
    },
    // 获取当前第几页
    getPageNo(pageNo) {
      // 整理参数
      this.searchParams.pageNo = pageNo;
      // 发送请求
      this.getData();
    }
  },
  watch: {
    // 监听路由的信息是否发生变化
    $route(newValue, oldValue) {
      // 发请求之前，整理数据
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getData();
      // 每次请求完毕，将数据清空
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
