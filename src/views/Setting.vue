<template>
  <div class="Setting">
    <div class="top">
      <span>设置</span>
    </div>
    <!-- 控制选项 -->
    <div class="switch">
      <van-cell center title="音量键翻页">
        <template #right-icon>
          <van-switch
            v-model="volumeChecked"
            size="24"
            active-color="#db3833"
            inactive-color="#bdbdbd"
          />
        </template>
      </van-cell>
      <van-cell center title="无图模式(只在WiFi下加载图片)">
        <template #right-icon>
          <van-switch
            v-model="picChecked"
            size="24"
            active-color="#db3833"
            inactive-color="#bdbdbd"
          />
        </template>
      </van-cell>
      <van-cell center title="阅读时展示系统通知栏">
        <template #right-icon>
          <van-switch
            v-model="noticeChecked"
            size="24"
            active-color="#db3833"
            inactive-color="#bdbdbd"
          />
        </template>
      </van-cell>
      <van-cell center title="点击两侧翻下一页">
        <template #right-icon>
          <van-switch
            v-model="clickChecked"
            size="24"
            active-color="#db3833"
            inactive-color="#bdbdbd"
          />
        </template>
      </van-cell>
    </div>
    <!--  -->
    <div class="cell">
      <van-cell title="休息时间" is-link value="1分钟" @click="showTime = true" />
      <van-action-sheet v-model="showTime" :actions="actionsT" @select="onSelectT" />
      <van-cell title="翻页动画" is-link value="滑动" @click="showSlide = true" />
      <van-action-sheet v-model="showSlide" :actions="actionsS" @select="onSelectS" />
    </div>

    <div class="cell">
      <van-cell v-if="light" title="日间模式" @click="light = !light" />
      <van-cell v-else title="夜间模式" @click="light = !light" />
      <van-cell title="检查更新" is-link value="1.0.5" />
      <van-cell title="关于" is-link />
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState } from 'vuex'

import types from "@/store/TYPES";

export default {
  name: "Setting",
  data() {
    return {
      volumeChecked: true,
      picChecked: false,
      noticeChecked: false,
      clickChecked: false,
      light: true,

      //   时间
      showTime: false,
      actionsT: [{ name: "1分钟" }, { name: "5分钟" }, { name: "永亮" }],
      //   翻页
      showSlide: false,
      actionsS: [{ name: "滑动" }, { name: "淡入" }, { name: "平移" }]
    };
  },
    computed: {
    ...mapState({
      showBottomSelect: state => state.showBottomSelect,
    })
  },
  methods: {
    onSelectT(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.showTime = false;
      Toast(item.name);
    },
     onSelectS(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.showSlide = false;
      Toast(item.name);
    }
  },
   created() {
     this.$store.commit(types.SHOW_BOTTOM_SELECT, {
            data: true
          });
  },
};
</script>

<style lang="less" scoped>
.Setting {
  background-color: #f6f5f5;
  height: 100vh;
}
.top {
  height: 40px;
  line-height: 40px;
  position: sticky;
  z-index: 999;
  width: 100%;
  text-align: center;
  background-color: #db3833;
  color: white;
  top: 0;
}
.switch {
  margin-top: 15px;
}
.cell {
  margin-top: 15px;
}
</style>