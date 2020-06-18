<template>
  <div class="Catalog">
    <van-nav-bar
      class="vtop"
      :title="bookDetails.title"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />

    <div class="chaptersCount">{{'共'+ bookDetails.chaptersCount + '章'}}</div>

    <van-tabs
      v-model="active"
      animated
      class="vsel"
      background="#dc3934"
      color="white"
      line-height="2"
      swipeable
      title-active-color="white"
      title-inactive-color="#fddcda"
    >
      <van-tab v-for="(item, index) in selects" :key="index" :title="item">
        <div class="scroll" v-if="active == 0" @scroll="scrollEvent">
          <van-pull-refresh v-model="refreshing" @refresh="initCatalog">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
              <van-cell
                v-for="(item,index) in list"
                :key="index"
                :title="item.num"
                @click="goBookRead(item.url)"
              />
            </van-list>
          </van-pull-refresh>
        </div>
        <div class="scroll" :class="{data: label.length == 0}" v-else>
          <div v-if="label.length>0">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @scroll="scrollEvent"
            >
              <van-cell v-for="(item,index) in label" :key="index" :title="item" />
            </van-list>
          </div>
          <div v-else>暂无数据</div>
        </div>
      </van-tab>
    </van-tabs>

    <div class="Operation">
      <div>
        <van-icon name="replay" />
        <span @click="refresh">刷新</span>
      </div>
      <div>
        <van-icon :name="reverse" />
        <span @click="reversed" v-if="isReverse">正序</span>
        <span @click="reversed" v-else>反序</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import types from "@/store/TYPES";

export default {
  name: "Catalog",
  data() {
    return {
      selects: ["目录"],
      active: 0,
      list: [],
      label: [],
      start: 0,
      end: 20,
      // 临时储存数据，用作懒加载展示
      tempList: [],
      loading: false,
      finished: false,
      reverse: require("../assets/images/reverse.png"),
      // 刷新
      refreshing: false,
      bookDetails: {},
      // 正逆序
      isReverse: false,
      //
      first: true
    };
  },
  computed: {
    ...mapState({
      bookDetail: state => state.bookDetail,
      book: state => state.book
    })
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    // 初始化目录（20）、刷新
    initCatalog() {
      // 初始化数据
      this.finished = false;
      this.loading = true;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.refreshing = true;

      this.start = 0;
      this.end = 20;

      if (this.active == 0) {
        let book = JSON.parse(localStorage.getItem("_book"));
        if (this.first) {
          this.tempList = book.catalog;
        }
        this.first = false;
      }

      if (this.active == 1) {
        this.tempList = this.label;
      }

      // 初次获取20条
      this.loading = true;
      if (this.tempList.length < 20) {
        this.list = this.tempList.slice(this.start, this.tempList.length);

        this.finished = true;
      } else {
        this.list = this.tempList.slice(this.start, this.end);
      }

      this.refreshing = false;
    },
    // 临时数据中分页处理
    getMore(num) {
      if (this.list.length == this.tempList.length) {
        this.finished = true;
        return;
      }
      if (this.list.length > 0 && this.list.length < this.tempList.length) {
        this.start += num;
        this.end += num;

        if (this.end > this.tempList.length) {
          this.end = this.tempList.length;
        }

        this.list = [
          ...this.list,
          ...this.tempList.slice(this.start, this.end)
        ];

        this.finished = true;
      }
    },
    // 判断触底加载更多
    scrollEvent(e) {
      if (e.target.scrollTop > (this.end - 19) * 44) {
        this.getMore(20);
      }
    },
    // 刷新
    refresh() {
      document.querySelector(".scroll").scrollTop = 0;
      // this.initCatalog();
    },
    // 逆序
    reversed() {
      this.isReverse = !this.isReverse;
      this.tempList = this.tempList.reverse();
      this.initCatalog();
      this.refresh();
    },
    // 去看书
    goBookRead(url) {
      this.$router.push({ name: "BookRead", params: { url } });
    }
  },
  created() {
    this.initCatalog();
    this.bookDetails = JSON.parse(localStorage.getItem("_bookDetail"));
  },
  watch: {
    active() {
      this.initCatalog();
    },
    tempList() {}
  }
};
</script>

<style lang="less" scoped>
.chaptersCount {
  position: absolute;
  z-index: 99999;
  text-align: center;
  top: 36px;
  width: 100%;
  font-size: 12px;
  color: white;
  background-color: #dc3934;
}
/deep/ .vtop .van-nav-bar {
  background-color: #dc3934;
  .van-nav-bar__title {
    color: white;
  }
  .van-icon {
    color: white;
  }
  .van-nav-bar__arrow {
    font-size: 20px;
  }
}
/deep/ .vtop .van-hairline--bottom::after {
  border: none;
}
/deep/ .vsel .van-hairline--top-bottom {
  top: 46px;
  position: fixed;
  z-index: 9999;
  width: 100%;
}
/deep/ .van-tabs__content.van-tabs__content--animated {
  position: absolute;
  top: 44px;
  width: 100%;
}
.scroll {
  height: calc(100vh - 140px);
  overflow-y: auto;
}
.data {
  display: flex;
  justify-content: center;
  align-items: center;
}
.Operation {
  display: flex;
  width: 100%;
  z-index: 99;
  position: fixed;
  bottom: 0;
  background-color: white;

  div {
    height: 50px;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active {
      background-color: rgb(219, 216, 216);
    }
  }
}
</style>