<template>
  <div class="bookCity">
    <div class="top">
      <span>书城</span>
      <van-icon name="search" @click="goSearch" />
    </div>
    <van-tabs
      v-model="active"
      animated
      title-active-color="#e1514b"
      class="vnav"
      swipeable
      @click="toggleChannel(active)"
    >
      <van-tab title="男生小说">
        <div class="content">
          <van-sidebar v-model="activeMale" class="vsiderbar">
            <van-sidebar-item
              v-for="(item, index) in rankingMale"
              :key="index"
              :title="item.shortTitle"
              :id="item._id"
              @click="getRangkingNavel(item._id)"
            />
          </van-sidebar>
          <div class="vscroll" @scroll="scrollEvent">
            <List :list="list"></List>
          </div>
        </div>
      </van-tab>
      <van-tab title="女生小说">
        <div class="content">
          <van-sidebar v-model="activeFemale">
            <van-sidebar-item
              v-for="(item, index) in rankingFemale"
              :key="index"
              :title="item.shortTitle"
              @click="getRangkingNavel(item._id)"
            />
          </van-sidebar>
          <div class="vscroll" @scroll="scrollEvent">
            <List :list="list"></List>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import List from "../components/List.vue";
import { mapState } from "vuex";
import types from "@/store/TYPES";

export default {
  name: "BookCity",
  data() {
    return {
      active: 0,
      activeMale: 0,
      activeFemale: 0,
      rankingMale: [],
      rankingFemale: [],

      list: [],
      // 临时储存数据，用作前端分页展示
      tempList: [],
      start: 0,
      end: 20
    };
  },
  computed: {
    ...mapState({
      showBottomSelect: state => state.showBottomSelect,
      loading: state => state.loading
    })
  },
  components: {
    List
  },
  methods: {
    //搜索页面
    goSearch() {
      this.$router.push("/search");
    },
    // 初次获取榜单
    getRankingMale() {
      this.$store.commit(types.LOADING, {
        data: true
      });
      this.axios
        .get("/https://api.zhuishushenqi.com/ranking/gender")
        .then(res => {
          // 
          // 男频
          this.rankingMale = res.data.male;
          // 
          // 女频
          this.rankingFemale = res.data.female;

          //默认获取男频第一个排行榜小说
          if (this.rankingMale.length > 0) {
            // 
            this.getRangkingNavel(this.rankingMale[0]._id);
          }
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
    //获取(切换)排行榜小说
    getRangkingNavel(id) {
      // 初始化数据
      this.start = 0;
      this.end = 20;
      this.tempList = [];
      this.list = [];
      this.$store.commit(types.LOADING, {
        data: true
      });
      this.axios
        .get(`/https://api.zhuishushenqi.com/ranking/${id}`)
        .then(res => {
          this.tempList.push(...res.data.ranking.books);
          // 初次获取20条
          this.list = this.tempList.slice(this.start, this.end);
        })
        .catch(err => {
          
        })
        .then(() => {
          this.$store.commit(types.LOADING, {
            data: false
          });
        });
    },
    // 切换男女频
    toggleChannel(active) {
      // 初始化数据
      this.start = 0;
      this.end = 20;
      this.tempList = [];
      this.list = [];

      if (active == 1) {
        let id = this.rankingFemale[0]._id;
        this.getRangkingNavel(id);
      } else {
        let id = this.rankingMale[0]._id;
        this.getRangkingNavel(id);
      }
    },
    // 临时数据中分页处理
    getMore(num) {
      if (this.list.length == this.tempList.length) {
        
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
        
      }
    },
    // 判断触底加载更多
    scrollEvent(e) {
      if (e.target.scrollTop > (this.end - 5) * 120) {
        this.getMore(20);
      }
    }
  },
  created() {
    this.getRankingMale();
    this.$store.commit(types.SHOW_BOTTOM_SELECT, {
      data: true
    });
  },
  watch: {
    active(v) {
      this.toggleChannel(v);
    }
  }
};
</script>
<style lang="less" scoped>
.top {
  height: 40px;
  line-height: 40px;
  position: fixed;
  z-index: 999;
  width: 100%;
  text-align: center;
  background-color: #db3833;
  color: white;
  i {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
    font-size: 20px;
  }
}

/deep/ .vnav .van-hairline--top-bottom {
  top: 40px;
  position: fixed;
  z-index: 9999;
  width: 100%;
}
/deep/ .van-tabs__content.van-tabs__content--animated {
  position: absolute;
  top: 84px;
  width: 100%;
}
.van-tab__pane {
  padding-bottom: 50px;
}
.content {
  display: flex;
  max-width: 100%;
  height: calc(100vh - 134px);
}
.vscroll {
  overflow-y: auto;
  flex: 1;
}
</style>
