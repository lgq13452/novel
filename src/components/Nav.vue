<template>
  <div class="nav">
    <van-tabbar v-model="active" active-color="#fe5f5b" inactive-color="#bfbfbf" route>
      <van-tabbar-item replace :to="active == 0 ? '' : '/' " @click="updatedActive(0)">
        <div class="vbo">
          <img :src="active == 0 ? icon1.active : icon1.inactive" />
          <span :class="{active: active == 0}">书架</span>
        </div>
      </van-tabbar-item>
      <van-tabbar-item replace :to="active == 1 ? '' : '/BookCity' " @click="updatedActive(1)">
        <div class="vbo">
          <img :src="active == 1 ? icon2.active : icon2.inactive" />
          <span :class="{active: active == 1}">书城</span>
        </div>
      </van-tabbar-item>
      <!-- <van-tabbar-item replace :to="active == 2 ? '' : '/Setting' " @click="updatedActive(2)">
        <div class="vbo">
          <img :src="active == 2 ? icon3.active : icon3.inactive" />
          <span :class="{active: active == 2}">设置</span>
        </div>
      </van-tabbar-item>-->
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

import types from "@/store/TYPES";
export default {
  name: "Nav",
  data() {
    return {
      active: 0,
      icon1: {
        active: require("../assets/images/book-act.png"),
        inactive: require("../assets/images/book.png")
      },
      icon2: {
        active: require("../assets/images/bcity-act.png"),
        inactive: require("../assets/images/bcity.png")
      },
      icon3: {
        active: require("../assets/images/setting-act.png"),
        inactive: require("../assets/images/setting.png")
      }
    };
  },
  created() {
    let activeSelect = localStorage.getItem("_activeSelect");
    if (activeSelect) {
      this.active = activeSelect;
    }
  },
  // computed: {
  //   ...mapState({
  //     activeSelect: state => state.activeSelect
  //   })
  // },
  methods: {
    updatedActive(num) {
      // this.$store.commit(types.ACTIVE_SELECT, {
      //   data: num
      // });

      localStorage.setItem("_activeSelect", num);
    }
  }
};
</script>

<style lang="less" scoped>
.vbo {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 18px;
  }
  span {
    margin-top: 5px;
    &.active {
      color: #fe5f5b;
    }
  }
}
</style>