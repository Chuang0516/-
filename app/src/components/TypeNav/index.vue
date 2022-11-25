<template>
    <div class="type-nav">
        <div class="container">
            <div @mouseleave="leaveShow" @mouseenter="enterShow">
                <h2 class="all">全部商品分类</h2>
                <Transition name="sort">
                    <div class="sort" v-show="show">
                        <!-- 利用 事件委派+编程式导航 实现路由跳转 -->
                        <div class="all-sort-list2" @click="goSearch">
                            <div class="item" v-for="(c1, index) in categoryList" :key="c1.categoryId">
                                <h3 @mouseenter="changeIndex(index)" :class="{ cur: currentIndex == index }">
                                    <!-- 给 a 标签绑定自定义属性 categoryName -->
                                    <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{
                                            c1.categoryName
                                    }}</a>
                                </h3>
                                <div class="item-list clearfix"
                                    :style="{ display: currentIndex == index ? 'block' : 'none' }">
                                    <div class="subitem" v-for="(c2, index) in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a :data-categoryName="c2.categoryName"
                                                    :data-category2Id="c2.categoryId">{{
                                                            c2.categoryName
                                                    }}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="(c3, index) in c2.categoryChild" :key="c3.categoryId">
                                                    <a :data-categoryName="c3.categoryName"
                                                        :data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">尚品汇超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';
export default {
    name: 'TypeNav',
    data() {
        return {
            // 存储用户鼠标悬浮在哪个一级分类
            currentIndex: -1,
            show: true,
        };
    },
    // 组件挂载完毕：向服务器发送请求
    mounted() {
        // 当组件挂载完毕，让 show 的属性
        if (this.$route.path != '/home') {
            this.show = false;
        }
    },
    computed: {
        ...mapState({ categoryList: (state) => state.home.categoryList }),
    },
    methods: {
        // 鼠标悬浮在哪个一级分类，修改 currentIndex
        changeIndex: throttle(function (index) {
            // 正常情况：鼠标进入，每一个一级分类 h3 ，都会触发鼠标进入事件
            // 非正常情况（用户鼠标滑过太快）：只有部分鼠标进入事件触发
            this.currentIndex = index;
        }, 5),
        // 进行路由跳转的方法
        goSearch(event) {
            // this.$router.push('/search');
            // 获取到点击的对象
            let element = event.target;
            // 获取自定义属性的值，ES6语法 结构赋值
            let { categoryname, category1id, category2id, category3id } =
                element.dataset;
            // 如果点击对象含有 categoryname 自定义属性，则为 a 标签
            if (categoryname) {
                // 整理路由跳转的参数
                let location = { name: 'search' };
                let query = { categoryName: categoryname };
                // 判断是几级分类
                if (category1id) {
                    query.category1Id = category1id;
                } else if (category2id) {
                    query.category2Id = category2id;
                } else {
                    query.category3Id = category3id;
                }
                if (this.$route.params) {
                    // 合并参数
                    location.query = query;
                    // 路由跳转
                    this.$router.push(location);
                }
            }
        },
        // 当鼠标移入的时候，让商品分类进行展示
        enterShow() {
            this.show = true;
        },
        // 当鼠标离开的时候，让商品分类进行隐藏
        leaveShow() {
            this.currentIndex = -1;
            // 只有在 Search 路由组件中才会执行
            if (this.$route.path != '/home') {
                this.show = false
            }
        }
    },
};
</script>

<style scoped lang="less">
.type-nav {
    border-bottom: 2px solid #e1251b;

    .container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        position: relative;

        .all {
            width: 210px;
            height: 45px;
            background-color: #e1251b;
            line-height: 45px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .nav {
            a {
                height: 45px;
                margin: 0 22px;
                line-height: 45px;
                font-size: 16px;
                color: #333;
            }
        }

        .sort {
            position: absolute;
            left: 0;
            top: 45px;
            width: 210px;
            position: absolute;
            background: #fafafa;
            z-index: 999;

            .all-sort-list2 {
                a {
                    cursor: pointer;
                }

                .item {
                    h3 {
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 400;
                        padding: 0 20px;
                        margin: 0;
                        overflow: hidden;

                        a {
                            color: #333;
                        }
                    }

                    .item-list {
                        display: none;
                        position: absolute;
                        width: 734px;
                        height: 100%;
                        background: #f7f7f7;
                        left: 210px;
                        border: 1px solid #ddd;
                        top: 0;
                        z-index: 9999 !important;

                        .subitem {
                            float: left;
                            width: 650px;
                            padding: 0 4px 0 8px;

                            dl {
                                border-top: 1px solid #eee;
                                padding: 6px 0;
                                overflow: hidden;
                                zoom: 1;

                                &.fore {
                                    border-top: 0;
                                }

                                dt {
                                    float: left;
                                    width: 54px;
                                    line-height: 22px;
                                    text-align: right;
                                    padding: 3px 6px 0 0;
                                    font-weight: 700;
                                }

                                dd {
                                    float: left;
                                    width: 500px;
                                    padding: 3px 0 0;
                                    overflow: hidden;

                                    em {
                                        float: left;
                                        height: 14px;
                                        line-height: 14px;
                                        padding: 0 8px;
                                        margin-top: 5px;
                                        border-left: 1px solid #ccc;
                                    }
                                }
                            }
                        }
                    }
                }

                .cur {
                    background-color: rgb(230, 230, 230);
                }
            }
        }

        // 过渡动画的样式
        // 进入的开始状态
        .sort-enter {
            opacity: 0;
        }

        .sort-enter-to {
            opacity: 1;
        }

        .sort-leave {
            opacity: 1;
        }

        .sort-leave-to {
            opacity: 0;
        }

        .sort-enter-active {
            transition: all .5s ease;
        }

        .sort-leave-active {
            transition: all .5s ease;
        }
    }
}
</style>
