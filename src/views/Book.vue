<template>
  <div class="book">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import types from "@/store/TYPES";
export default {
  name: "Book",
  computed: {
    ...mapState({
      showBottomSelect: state => state.showBottomSelect
    })
  },
  created() {
    this.$store.commit(types.SHOW_BOTTOM_SELECT, {
      data: false
    });
  }
};
</script>

<style lang="less" scoped>
</style>