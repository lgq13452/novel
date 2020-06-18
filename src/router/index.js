import Vue from 'vue'
import VueRouter from 'vue-router'
// import BookShelf from '../views/BookShelf.vue'

Vue.use(VueRouter)

//导入路由配置
import {routes} from './routers'




const router = new VueRouter({
  routes
})

export default router