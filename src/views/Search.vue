<template>
  <div class="Search">
    <form>
      <van-search
        background="#db3833"
        v-model="searchKey"
        show-action
        placeholder="书名、作者、关键字"
        @input="searchAuto"
        @clear="initData"
        @cancel="onCancel"
        @search="searchSure"
        ref="ipt"
      />
    </form>
    <div class="onput" v-if="vshow">
      <!-- 热门书籍 -->
      <div class="model">
        <div class="title">热门书籍</div>
        <div class="list">
          <div
            class="alis"
            v-for="(item, index) in hotList"
            :key="index"
            @click="searchSure(item.word);searchKey=item.word"
          >{{item.word}}</div>
        </div>
      </div>
      <!-- 热门搜索 -->
      <div class="model">
        <div class="title">热门搜索</div>
        <div class="list">
          <div
            class="blis"
            v-for="(item, index) in hotBook.newHotWords"
            :key="index"
            @click="searchSure(item.word);searchKey=item.word"
          >{{item.word}}</div>
        </div>
      </div>
      <!-- 搜索历史 -->
      <div class="model">
        <div class="title">
          搜索历史
          <span class="vicon" @click="deleHistorySearch(0)">
            <van-icon name="cross" />
          </span>
        </div>
        <div class="list">
          <div
            class="blis"
            v-for="(item, index) in historySearch"
            :key="index"
            @click="searchSure(item);searchKey=item"
          >
            {{item}}
            <span class="vicon" @click.stop="deleHistorySearch(1,index)">
              <van-icon name="close" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="searchList" v-else>
      <!-- 搜索推荐 -->
      <div class="vli" v-if="searchRecommend.length > 0">
        <div class="vlis" v-for="(item, index) in searchRecommend" :key="index">{{item}}</div>
      </div>
      <!-- 搜索结果 -->
      <div class="vlist" @scroll="scrollEvent" v-if="searchResult.length > 0">
        <List :list="searchResult"></List>
      </div>
    </div>
  </div>
</template>

<script>
import List from "../components/List.vue";

import { mapState } from "vuex";

import types from "@/store/TYPES";

export default {
  name: "Search",
  data() {
    return {
      searchKey: "",
      searchRecommend: [],
      searchResult: [],
      vshow: true,
      // 搜索书籍(全部)
      searchHot: [],
      // 用于展示
      hotList: [],
      // 热门搜索
      hotBook: [],
      // 临时储存数据，用作前端分页展示
      tempList: [],
      start: 0,
      end: 20,
      // 搜索历史
      historySearch: []
    };
  },
  computed: {
    ...mapState({
      showBottomSelect: state => state.showBottomSelect
    })
  },
  components: {
    List
  },
  methods: {
    // 初始化数据
    initData() {
      this.searchRecommend = [];
      this.searchResult = [];
      this.tempList = [];
      this.vshow = true;
    },
    // 搜索推荐(自动补全)
    searchAuto(key) {
      this.vshow = false;
      this.searchResult = [];
      if ((typeof key == "string" && key.trim() == "") || key == null) {
        this.initData();
        return;
      }
      this.axios
        .get(
          `/https://api.zhuishushenqi.com/book/auto-complete?query=${key}&start=0&limit=2`
        )
        .then(res => {
          
          if (res.data.keywords.length == 0) {
            
          }
          this.searchRecommend = res.data.keywords;
        })
        .catch(err => {
          console.error(err);
        });
    },
    onCancel() {
      this.vshow = true;
      this.initData();
      this.$router.go(-1);
    },
    // 确认搜索
    searchSure(k) {
      this.updaeHistorySearch(k);
      // 初始化数据
      this.initData();

      this.start = 0;
      this.end = 20;
      this.vshow = false;
      this.axios
        .get(`/https://api.zhuishushenqi.com/book/fuzzy-search?query=${k}`)
        .then(res => {
          

          this.tempList = res.data.books;
          this.searchResult = this.tempList.slice(0, 20);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 随机获取展示(num)
    getRandom(arr, num) {
      let array = [...arr];

      let newArr = []; //创建一个新数组
      for (let i = 0; i < num; i++) {
        let temp = Math.floor(Math.random() * array.length); //取随机下标
        newArr.push(array[temp]); //添加到新数组
        array.splice(temp, 1); //删除当前的数组元素,避免重复
      }
      
      return newArr;
    },

    // 获取热门书籍
    getSearchHot() {
      // 获取搜索热词
      // 在本地储存中查找
      let localSearchHot = JSON.parse(localStorage.getItem("_searchHot"));
      
      if (localSearchHot && localSearchHot.expires > Date.now()) {
        this.searchHot = localSearchHot.data;
        // 随机展示
        this.hotList = this.getRandom(this.searchHot, 10);
      } else {
        this.axios
          .get("https://novel.kele8.cn/search-hotwords")
          .then(res => {
            this.searchHot = res.data.searchHotWords;

            this.hotList = this.getRandom(res.data.searchHotWords, 10);

            localStorage.setItem(
              "_searchHot",
              JSON.stringify({
                expires: Date.now() + 1000 * 60 * 60 * 24,
                data: res.data.searchHotWords
              })
            );
          })
          .catch(err => {
            console.error(err);
          });
      }
    },

    // 获取热门搜素
    getHotBook() {
      this.axios
        .get("https://novel.kele8.cn/hot-books")
        .then(res => {
          
          this.hotBook = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },

    // 获取历史搜索
    getHistorySearch() {
      let localHistorySearch = JSON.parse(
        localStorage.getItem("_historySearch")
      );
      if (localHistorySearch) {
        this.historySearch = [...localHistorySearch];
      }
    },

    // 更新搜索历史
    updaeHistorySearch(keywords) {
      // 去重
      let isExist = this.historySearch.some(item => item == keywords);

      if (!isExist) {
        this.historySearch.unshift(keywords);
        localStorage.setItem(
          "_historySearch",
          JSON.stringify(this.historySearch)
        );
      }
    },

    // 删除历史搜索
    deleHistorySearch(type, index) {
      // type: 0全删 1删除单前
      if (type == 1) {
        this.historySearch.splice(index, 1);
        localStorage.setItem(
          "_historySearch",
          JSON.stringify(this.historySearch)
        );
      } else {
        this.historySearch = [];
        localStorage.removeItem("_historySearch");
      }
    },

    // 临时数据中分页处理
    getMore(num) {
      if (this.searchResult.length == this.tempList.length) {
        
        return;
      }

      if (
        this.searchResult.length > 0 &&
        this.searchResult.length < this.tempList.length
      ) {
        this.start += num;
        this.end += num;

        if (this.end > this.tempList.length) {
          this.end = this.tempList.length;
        }

        

        this.searchResult = [
          ...this.searchResult,
          ...this.tempList.slice(this.start, this.end)
        ];
        

        this.isLoad = true;
      }
    },
    // 判断触底加载更多
    scrollEvent(e) {
      if (e.target.scrollTop > (this.end - 10) * 120) {
        this.getMore(20);
      }
    }
  },
  created() {
    this.getSearchHot();
    // 获取热门搜素
    this.getHotBook();
    // 获取历史搜索
    this.getHistorySearch();
    // 底部导航不可见
    this.$store.commit(types.SHOW_BOTTOM_SELECT, {
      data: false
    });
  },
  mounted() {
    document.querySelector(".Search input").focus();
  }
};
</script>

<style lang="less" scoped>
.Search {
  background-color: #f6f6f6;
  height: 100vh;
}
form {
  top: 0;
  position: sticky;
  width: 100%;
  z-index: 9;
}
/deep/.van-search .van-search__action {
  color: white;
}

.vlist {
  top: 54px;
  position: absolute;
  overflow-y: auto;
  height: 100vh;
  width: 100%;
}
.vli {
  top: 54px;
  position: absolute;
  overflow-y: auto;
  width: 100%;
  .vlis {
    height: 40px;
    line-height: 40px;
    margin-left: 15px;
    width: 100%;
  }
}

.model {
  margin: 0 10px;
  background-color: white;
  border-radius: 5px;
  &:last-child {
    min-height: 150px;
  }
  .title {
    margin: 8px;
    color: #999;
    padding-top: 8px;
    .vicon {
      right: 20px;
      position: absolute;
    }
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  & > div {
    padding: 5px 10px;
    border-radius: 6px;
    margin: 5px 10px;
    color: #6d6d6d;
    font-size: 14px;
    background-color: #f6f6f6;
  }
  .blis {
    padding: 3px 10px;
  }
}
</style>
