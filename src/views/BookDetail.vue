<template>
  <div class="BookDetail">
    <div class="top">
      <van-icon name="arrow-left" class="vicc" @click="goBack" />
      <span>书籍详情</span>
    </div>
    <div class="bookTop">
      <div class="left">
        <img v-lazy="unescape(bookDetail.cover)" />
      </div>
      <div class="right">
        <h3>{{bookDetail.title}}</h3>
        <div class="bookInfo">
          <img class="userIcon" src="../assets/images/user.png" alt />
          <div class="user">{{bookDetail.author}}</div>
        </div>
        <span class="vtype">{{bookDetail.minorCate}}</span> ·
        <span class="count">{{dealCount(bookDetail.wordCount)}}</span>
        <div class="copyright">来源：{{bookDetail.copyright}}</div>
      </div>
    </div>
    <!-- 描述 -->
    <div class="desc">
      <h5 :class="{showMore: isShowMore , showLess: !isShowMore}">{{bookDetail.longIntro}}</h5>
      <span ref="isShow" @click="showMore()">展开</span>
    </div>
    <!-- 目录 -->
    <div class="catalog" @click="goCatalog(bookDetail.title)">
      <div>目录</div>
      <div>{{bookDetail.lastChapter}}</div>
      <div>{{dealTime(bookDetail.updated)}}</div>
    </div>

    <!-- 推荐好书 -->
    <div class="recommend">
      <div class="recommend-top">
        <h3>推荐好书</h3>
        <div class="vicon">
          <van-icon name="replay" />
          <span @click="toggleRecommend">换一换</span>
        </div>
      </div>
      <!-- 列表 -->
      <van-grid icon-size="72" replace>
        <van-grid-item
          v-for="(item, index) in tempRecommend"
          :key="index"
          :icon="unescape(item.cover)"
          :text="item.title"
          :id="item._id"
          @click="bookId = item._id"
        />
      </van-grid>
    </div>

    <!-- 操作功能 -->
    <Operation :name="bookDetail.title" :cover="unescape(bookDetail.cover)"></Operation>
  </div>
</template>

<script>
// 导入公共方法
import { tool } from "../assets/js/tool";

import Operation from "../components/Operation.vue";

import { mapState } from "vuex";

import types from "@/store/TYPES";

import { Toast } from "vant";

export default {
  name: "BookDetail",
  data() {
    return {
      bookId: "",
      isShowMore: false,
      recommendBook: [],
      // 临时推荐
      tempRecommend: [],
      // 版权
      copyright: false
    };
  },
  components: {
    Operation
  },
  computed: {
    ...mapState({
      bookDetail: state => state.bookDetail,
      loading: state => state.loading
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    //   获取书本详情
    getBookDetail(id) {
      this.$store.commit(types.LOADING, {
        data: true
      });
      this.axios
        .get(`https://novel.kele8.cn/book-info/${id}`)
        .then(res => {
          this.$store.commit(types.BOOK_DETAIL, {
            data: res.data
          });
          localStorage.setItem("_bookDetail", JSON.stringify(res.data));
        })
        .catch(err => {
          console.error(err);
        })
        .then(() => {
          this.$store.commit(types.LOADING, {
            data: false
          });
        });
    },
    // 解码url
    unescape(str) {
      // /agent/
      return unescape(str).replace("/agent/", "");
    },
    // 处理字数方法
    dealCount(num) {
      if (num > 9999) {
        return (num / 10000).toFixed(1) + "万字";
      } else if (num > 999) {
        return (num / 1000).toFixed(1) + "千字";
      } else {
        return num + "字";
      }
    },
    // 展示更多描述
    showMore() {
      this.isShowMore = !this.isShowMore;
      if (this.isShowMore) {
        this.$refs.isShow.textContent = "收回";
      } else {
        this.$refs.isShow.textContent = "展开";
      }
    },
    // 处理最后更新时间
    dealTime(time) {
      let thisTime = tool.formatDate(new Date(time), "yyyy-MM-dd hh:mm:ss");
      thisTime = thisTime.replace(/-/g, "/");
      let times = new Date(thisTime).getTime();

      let ago = tool.parseTimeDay(times);
      return ago;
    },

    // 推荐书籍
    recommend(id) {
      this.axios
        .get(`https://novel.kele8.cn/recommend/${id}`)
        .then(res => {
          //
          this.recommendBook = res.data.books;

          this.tempRecommend = this.recommendBook.slice(0, 8);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 更多推荐
    toggleRecommend() {
      let [...arr] = this.recommendBook;
      let newArr = [];
      for (let i = 0; i < 8; i++) {
        let temp = Math.floor(Math.random() * arr.length);
        newArr.push(arr[temp]);
        arr.splice(temp, 1);
      }
      this.tempRecommend = newArr;
    },

    // 查看目录
    goCatalog(name) {
      let urlList = "";
      this.$store.commit(types.LOADING, {
        data: true
      });
      this.axios
        .get(`/https://api.pingcc.cn/?xsname=${name}`)
        .then(res => {
          if (res.data.code == 1) {
            setTimeout(() => {
              this.$store.commit(types.LOADING, {
                data: false
              });
            }, 300);
            Toast.fail("暂无版权");
            return;
          }
          if (res.data.code == 0) {
            urlList = res.data.list[res.data.list.length - 1].url;

            this.$store.commit(types.LOADING, {
              data: false
            });
            // 成功
            this.copyright = true;
          }
        })
        .catch(err => {
          console.error(err);
          setTimeout(() => {
            this.$store.commit(types.LOADING, {
              data: false
            });
          }, 3000);
        })
        .then(() => {
          if (this.copyright) {
            this.axios
              .get("/https://api.pingcc.cn", {
                params: {
                  xsurl1: urlList
                }
              })
              .then(res => {
                this.$store.commit(types.BOOK, {
                  data: {
                    name,
                    cover: this.unescape(this.bookDetail.cover),
                    catalog: res.data.list
                  }
                });
                // 将书本存到本地
                localStorage.setItem(
                  "_book",
                  JSON.stringify({
                    name: name,
                    cover: this.unescape(this.bookDetail.cover),
                    catalog: res.data.list
                  })
                );

                this.$router.push({
                  path: "/book/catalog"
                });
              })
              .catch(err => {
                console.error(err);
              })
              .then(() => {
                this.$store.commit(types.LOADING, {
                  data: false
                });
              });
          }
        });
    }
  },
  watch: {
    bookId() {
      this.getBookDetail(this.bookId);
      this.recommend(this.bookId);
    }
  },
  created() {
    this.bookId = this.$route.params.id;
    //
    this.getBookDetail(this.bookId);
    this.recommend(this.bookId);
  }
};
</script>

<style lang="less" scoped>
.vicc {
  position: absolute;
  left: 0;
  font-size: 24px;
  margin-top: 10px;
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
.bookTop {
  display: flex;
}
.left {
  width: 85px;
  padding: 15px;
  img {
    width: 85px;
    vertical-align: middle;
  }
}
.right {
  padding: 10px;
  color: #888888;
  font-size: 12px;

  h3 {
    font-size: 18px;
    margin: 0;
    width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: black;
  }
  .bookInfo {
    margin: 13px 0;
    display: flex;
    position: relative;
    .userIcon {
      width: 14px;
      height: 16px;
      margin-right: 3px;
    }
  }
  .copyright {
    margin-top: 6px;
  }
}
.desc {
  color: #888888;
  font-size: 13px;
  position: relative;
  h5 {
    padding: 0 15px;
    margin: 0;
    font-size: 13px;
    line-height: 20px;

    &.showLess {
      overflow: hidden;
      text-overflow: ellipsis;
      // white-space: pre-wrap;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &.showMore {
      height: auto;
    }
  }
  span {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #db3833;
  }
}
.catalog {
  margin-top: 10px;
  display: flex;
  align-items: center;

  div {
    padding: 10px;
    padding-right: 0;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    color: #888888;
    background-color: rgba(245, 244, 244, 0.925);

    &:first-child {
      font-size: 20px;
      color: black;
      flex: 1.5;
    }
    &:nth-child(2) {
      flex: 6.5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:last-child {
      flex: 2;
    }
  }
}
/deep/ .van-grid-item__content--center {
  justify-content: normal;
}
.recommend {
  padding-bottom: 35px;
}
.recommend-top {
  display: flex;
  align-items: center;
  padding: 0 10px;
  h3 {
    margin: 10px 0;
  }
  .vicon {
    position: absolute;
    right: 15px;
    color: #888888;
  }
}
/deep/ .van-grid-item__text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>