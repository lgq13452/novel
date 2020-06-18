<template>
  <div class="list">
    <div
      class="lis"
      v-for="(item, index) in list"
      :key="index"
      :id="item._id"
      @click="goBookDetail(item._id)"
    >
      <div class="left">
        <img v-lazy="unescape(item.cover)" />
      </div>
      <div class="right">
        <h3>{{item.title}}</h3>
        <div class="bookInfo">
          <img class="userIcon" src="../assets/images/user.png" alt />
          <div class="user">{{item.author}}</div>
          <div class="vtype" v-if="item.retentionRatio > 0">{{item.retentionRatio}}留存</div>
        </div>
        <h5>{{item.shortIntro}}</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  props: {
    list: Array
  },
  methods: {
    unescape(str) {
      // /agent/
      return unescape(str).replace("/agent/", "");
    },
    goBookDetail(id) {
      this.$router.push({
       path:`/bookDetail/${id}`
      });
    }
  }
};
</script>

<style scoped lang="less">
.list {
  .lis {
    height: 120px;
    display: flex;
    border-bottom: 1px solid #e6e6e6;
    .left {
      width: 80px;
      padding: 10px;
      img {
        display: block;
        width: 65px;
      }
    }
    .right {
      padding: 10px;

      h3 {
        margin: 0;
        width: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .bookInfo {
        font-size: 12px;
        margin-top: 7px;
        display: flex;
        position: relative;
        color: #888888;
        .userIcon {
          width: 14px;
          height: 14px;
          margin-right: 3px;
        }
        .vtype {
          position: absolute;
          right: 20px;
        }
      }
      h5 {
        color: #888888;
        margin: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
