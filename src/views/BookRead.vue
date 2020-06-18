<template>
  <div class="BookRead" :class="{night:key}" @click="test">
    <!-- back -->
    <van-sticky>
      <van-icon class="back" name="arrow-left" color="white" size="36" @click="goBack" />
    </van-sticky>

    <div class="content">
      <div class="scroll" @scroll="touchBottom">
        <div class="title">{{textContent.num}}</div>
        <div class="list">
          <div class="lis" v-for="(item, index) in textContent.content" :key="index">{{item}}</div>
        </div>
      </div>
      <!-- 功能面板 -->
      <van-action-sheet v-model="show" :overlay="false">
        <div class="content">
          <div class="bot">
            <div @click="prevNext(0)">上一章</div>
            <div @click="prevNext(1)">下一章</div>
            <div @click="viewCatalog">目录</div>
            <!-- <div>设置</div> -->
          </div>
        </div>
      </van-action-sheet>
      <div class="lightBox" v-if="show">
        <div class="model vvicon" @click="changeLightType" v-if="key">
          <img src="../assets/images/night.png" alt />
          <span>夜间</span>
        </div>
        <div class="model vvicon" @click="changeLightType" v-else>
          <img src="../assets/images/light.png" alt />
          <span>日间</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { Toast } from "vant";

import types from "@/store/TYPES";

export default {
  name: "BookRead",
  data() {
    return {
      url: "",
      textContent: {},
      show: false,
      key: null,
      localCatalog: []
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading,
      isNight: state => state.isNight
    })
  },
  methods: {
    //   获取文章内容
    getText(url) {
      this.$store.commit(types.LOADING, {
        data: true
      });
      this.axios
        .get("/https://api.pingcc.cn", {
          params: {
            xsurl2: url
          }
        })
        .then(res => {
          //
          this.textContent = res.data;
        })
        .catch(err => {})
        .then(() => {
          this.$store.commit(types.LOADING, {
            data: false
          });
        });
    },
    // 点击中间区域出现功能栏
    test(e) {
      let windowWidth = window.screen.width;
      // let windowHeight = window.screen.height;
      if (e.clientX / windowWidth > 1 / 3 && e.clientX / windowWidth < 2 / 3) {
        this.show = !this.show;
      } else {
        if (this.show) {
          this.show = false;
        }
      }

      if (e.clientX / windowWidth < 1 / 3) {
        this.prevNextPage(0);
      } else if (e.clientX / windowWidth > 2 / 3) {
        this.prevNextPage(1);
      }
    },
    // 点击两侧上下页
    prevNextPage(type) {
      // 如果有上一章 翻到第一页跳到上一章
      // 若果有下一章 翻到最后一页跳到下一章
      // 可视区
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      if (type == 1) {
        document.querySelector(".scroll").scrollTop =
          document.querySelector(".scroll").scrollTop + windowHeight - 75;

        if (document.querySelector(".scroll").scrollTop == 0) {
          this.prevNext(1);
        }
      } else {
        document.querySelector(".scroll").scrollTop =
          document.querySelector(".scroll").scrollTop - windowHeight;

        if (document.querySelector(".scroll").scrollTop == 0) {
          this.prevNext(0);
        }
      }
    },

    //改变亮度模式
    changeLightType() {
      this.key = !this.key;

      localStorage.setItem("_lightType", JSON.stringify(this.key));

      // 缓存亮度模式
      this.$store.commit(types.ISNIGHT, {
        data: this.key
      });
    },
    // 返回上一步
    goBack() {
      this.$router.go(-1);
    },
    // 获取目录
    getlocalCatalog() {
      this.localCatalog = JSON.parse(localStorage.getItem("_book")).catalog;
      //
    },
    // 查看目录
    viewCatalog() {
      let currentBook = JSON.parse(localStorage.getItem("_book"));
      this.$router.push({
        path: "/book/catalog"
      });
    },
    // 上下章
    prevNext(type) {
      // 找到当前章
      let goUrl;
      let currentCatalog;

      this.localCatalog.forEach((item, index) => {
        if (item.url == this.url) {
          currentCatalog = index;
        }
      });

      if (type == 0) {
        if (currentCatalog == 0) {
          //

          return;
        }
        goUrl = this.localCatalog[currentCatalog - 1].url;

        this.getText(goUrl);

        this.url = goUrl;
        document.querySelector(".scroll").scrollTop = 0;
        this.$store.commit(types.LOADING, {
          data: false
        });
      }

      if (type == 1) {
        if (currentCatalog == this.localCatalog.length - 1) {
          //
          this.$store.commit(types.LOADING, {
            data: false
          });
           Toast.fail("已经是最后一章了");
          return;
        }
        goUrl = this.localCatalog[currentCatalog + 1].url;

        this.getText(goUrl);
        this.url = goUrl;
        document.querySelector(".scroll").scrollTop = 0;
        this.$store.commit(types.LOADING, {
          data: false
        });
      }
    },
    // 滑动触底下一章
    touchBottom(e) {
      //变量 windowHeight 是可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;

      if (e.target.scrollTop > e.target.scrollHeight - windowHeight - 45) {
        this.$store.commit(types.LOADING, {
          data: true
        });

        setTimeout(() => {
          this.prevNext(1);
        }, 2000);
      }
    }
  },
  created() {
    this.url = this.$route.params.url;
    this.getText(this.url);
    this.getlocalCatalog();

    let localLight = JSON.parse(localStorage.getItem("_lightType"));
    if (localLight) {
      this.key = localLight;
    } else {
      this.key = this.isNight;
    }
  }
};
</script>

<style lang="less" scoped>
.BookRead {
  background-color: #b4c5b3;
  color: black;
  width: 100%;
  .back {
    background-color: #2a2a2a;
    opacity: 0.98;
    width: 100vw;
  }
  /deep/ .van-icon-arrow-left::before {
    color: #f1f0f0f1;
  }
  &.night {
    background-color: #0d0d0d;
    color: rgba(172, 172, 172, 0.945);
  }
  .title {
    font-size: 24px;
    padding: 15px;
  }
  .list {
    text-indent: 2em;
    font-size: 20px;
    line-height: 1.5em;
  }
  /deep/ .van-popup--bottom.van-popup--round {
    bottom: -1px;
    height: 60px;
    background-color: #2a2a2a;
    color: white;
  }
}
.content {
  min-height: calc(100vh);
  // margin-bottom: 20px;
  padding-left: 10px;
  overflow: hidden;
  .scroll {
    height: 100vh;
    overflow-y: auto;
  }

  .bot {
    display: flex;
    justify-content: space-around;
    bottom: 0;
    position: absolute;
    width: 100%;
    margin-bottom: 20px;
  }
}
.vvicon {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 24px;
    vertical-align: middle;
  }
  span {
    margin-top: 6px;
  }
}
.lightBox {
  position: sticky;
  bottom: 60px;
  display: flex;
  justify-content: flex-end;
}
.model {
  position: fixed;
  bottom: 60px;
  right: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid white;
  background-color: #2a2a2a;
  color: white;
  span {
    font-size: 12px;
    margin: 0;
  }
}
</style>