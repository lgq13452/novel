<template>
  <div class="BookShelf">
    <van-sticky>
      <van-search
        background="#db3833"
        v-model="searchKey"
        placeholder="书名、作者、关键字"
        @focus="goSearch"
      />
    </van-sticky>
    <div class="shelf">
      <div class="tips" v-if="bookshelf.length < 1">
        <div>
          <van-empty description="书架竟然没有书" />
        </div>
      </div>

      <div class="books" v-if="bookshelf">
        <van-grid :column-num="3" :gutter="10" icon-size="90" :border="false" clickable>
          <van-grid-item
            v-for="(item, index) in bookshelf"
            :key="index"
            :icon="item.cover"
            :text="item.name"
            @click="goBookRead(item)"
          />
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";

import types from "@/store/TYPES";

export default {
  name: "BookShelf",
  components: {},
  data() {
    return {
      searchKey: "",
      bookshelf: [],
      isShow: true
    };
  },
  computed: {
    ...mapState({
      book: state => state.book,
      showBottomSelect: state => state.showBottomSelect
    })
  },
  methods: {
    goSearch() {
      this.$router.push("/search");
    },
    // 查看本地书架
    showShelf() {
      let localBooks = JSON.parse(localStorage.getItem("_booksCollection"));
      if (localBooks) {
        this.bookshelf = localBooks;
      }
    },
    // 开始看书
    goBookRead(item) {
      this.$store.commit(types.BOOK, {
        data: item
      });
      localStorage.setItem('_book',JSON.stringify(item))
      // 替换目录
      this.$router.push({
        name: "BookRead",
        params: { url: item.currentCatalog.url }
      });
    }
  },
  created() {
    this.$store.commit(types.SHOW_BOTTOM_SELECT, {
      data: true
    });
    this.showShelf();
  }
};
</script>

<style lang="less" scoped>
.BookShelf {
  height: 100vh;
  // background-color: lightgray;
   background-color: rgba(211, 211, 211, 0.432);
}
.shelf {
  // background-color: rgba(211, 211, 211, 0.432);
}
.books {
  padding-bottom: 55px;
}
/deep/ .van-grid-item__text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
/deep/
  .van-grid-item__content.van-grid-item__content--center.van-grid-item__content--clickable {
  filter: brightness(0.95);
}
form {
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 9;
}
/deep/.books.van-search .van-search__action {
  color: white;
}
.tips {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 104px);
}
</style>
