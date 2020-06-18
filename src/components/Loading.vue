<template>
  <div class="Loading" v-if="loading">
    <img src="../assets/images/loading.svg" alt width="44px" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import types from "@/store/TYPES";
export default {
  name: "Loading",
  computed: {
    ...mapState({
      loading: state => state.loading
    })
  }
};
</script>

<style lang="less" scoped>
.Loading {
  display: flex;
  justify-content: center;
  align-items: center;
  // height: calc(100vh - 104px);
  background-color: rgba(222, 227, 231, 0.733);
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}
</style>