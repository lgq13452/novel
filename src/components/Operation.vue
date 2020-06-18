<template>
  <div class="Operation">
    <div @click="addBook(name)" v-if="exitBook">已加入书架</div>
    <div @click="addBook(name)" v-else>加入书架</div>
    <div @click="goRead(name)">
      <span>开始阅读</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import types from "@/store/TYPES";

import { Toast } from "vant";
export default {
  name: "Operation",
  props: {
    name: String,
    cover: String
  },
  data() {
    return {
      copyright: false,
      // 书架是否已经存在
      exitBook: false
    };
  },
  computed: {
    ...mapState({
      bookCatalog: state => state.bookCatalog,
      loading: state => state.loading
    })
  },

  methods: {
    // 开始阅读方法(第一章)
    goRead(name) {
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
                    cover: this.cover,
                    catalog: res.data.list
                  }
                });

                // 将书本存到本地
                localStorage.setItem(
                  "_book",
                  JSON.stringify({
                    name: this.name,
                    cover: this.cover,
                    catalog: res.data.list
                  })
                );

                this.$router.push({
                  name: "BookRead",
                  params: { url: res.data.list[0].url }
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
    },
    // 书架是否已经存在
    isExisBook(name) {
      let localBooks = [];
      // 判断书籍是否已经存在
      // 
      localBooks = JSON.parse(localStorage.getItem("_booksCollection"));
      //

      if (localBooks) {
        let isExist = localBooks.some(item => item.name == name);

        // 

        if (!isExist) {
          this.exitBook = false;
        } else {
          this.exitBook = true;
          
          return;
        }
      } else {
        this.exitBook = false;
      }
    },

    // 添加到书架
    addBook(name) {
      let urlList = "";
      let localBooks = [];

      if (this.exitBook) {
        
        return;
      }

      this.$store.commit(types.LOADING, {
        data: true
      });
      this.axios
        .get(`/https://api.pingcc.cn/?xsname=${this.name}`)
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
                  data: res.data.list
                });
                // 将书本存到本地

                // 判断书籍是否已经存在
                localBooks = JSON.parse(
                  localStorage.getItem("_booksCollection")
                );
                if (localBooks) {
                  let isExist = localBooks.some(item => item.name == name);

                  

                  if (!isExist) {
                    this.exitBook = true;

                    localBooks.unshift({
                      name: this.name,
                      cover: this.cover,
                      currentCatalog: res.data.list[0],
                      catalog: res.data.list
                    });
                    localStorage.setItem(
                      "_booksCollection",
                      JSON.stringify(localBooks)
                    );
                  } else {
                    
                    return;
                  }
                } else {
                  this.exitBook = true;

                  localBooks = [];

                  

                  

                  localBooks.push({
                    name: this.name,
                    cover: this.cover,
                    currentCatalog: res.data.list[0],
                    catalog: res.data.list
                  });
                  // 

                  localStorage.setItem(
                    "_booksCollection",
                    JSON.stringify(localBooks)
                  );
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
          }
        });
    }
  },
  watch: {
    name(newV, oldV) {
      this.isExisBook(newV);
    },
    exitBook() {}
  },
  created() {},
  mounted() {
    // 
  }
};
</script>

<style lang="less" scoped>
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
    color: #e6746f;
    &:last-child {
      background-color: #db3933;
      color: white;
    }
  }
}
</style>