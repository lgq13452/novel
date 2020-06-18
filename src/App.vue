<template>
  <div id="app">
    <router-view />
    <!-- <div id="buttom"> -->
    <!-- <router-link to="/">书架</router-link>
      <router-link to="/about">书城</router-link>
    <router-link to="/about">设置</router-link>-->
    <!-- </div> -->
    <Loading></Loading>
    <Nav v-show="showBottomSelect"></Nav>
  </div>
</template>
<script>
import Nav from "./components/Nav.vue";
import Loading from "./components/Loading.vue";

import { mapState } from "vuex";

import types from "@/store/TYPES";

export default {
  components: {
    Nav,
    Loading
  },
  computed: {
    ...mapState({
      showBottomSelect: state => state.showBottomSelect,
      loading: state => state.loading
    })
  }
};
</script>

<style lang="less">
#buttom {
  position: fixed;
  bottom: 0;
  width: 100%;
  // left: 0;
}
</style>
