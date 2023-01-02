<template>
    <div class="swiper-container" ref="mySwiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(carousel, index) in list" :key="carousel.id">
                <img :src="carousel.imgUrl">
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>

<script>
// 引入 swiper
import Swiper from 'swiper';
export default {
    name: 'Carousle',
    props: ['list'],
    watch: {
        list: {
            // 立即监听，不等数据变化，直接监听
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    new Swiper(this.$refs.mySwiper, {
                        autoplay: true,
                        loop: true,
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        },
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true,
                        },
                    });
                })
            }
        }
    }
}
</script>

<style>

</style>
