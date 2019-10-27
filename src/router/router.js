import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/welcome.vue'
import User from '@/views/users/index.vue'
import Right from '@/views/right/rightlist.vue'
import Role from '@/views/right/rolelist.vue'
import Goods from '@/views/goods/goodlist.vue'
import Lists from '@/views/goods/lists.vue'
import Add from '@/views/goods/add.vue'
Vue.use(VueRouter)
var router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'wel' },
      children: [
        {
          name: 'wel',
          path: 'wel',
          component: Welcome
        },
        {
          name: 'user',
          path: 'users',
          component: User
        },
        {
          name: 'right',
          path: 'rights',
          component: Right
        },
        {
          name: 'role',
          path: 'roles',
          component: Role
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'lists' },
          children: [
            {
              name: 'lists',
              path: 'lists',
              component: Lists
            },
            {
              name: 'add',
              path: 'add',
              component: Add
            }
          ]
        }
      ]
    }
  ]
})

export default router
