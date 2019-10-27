import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import store from './store'

Vue.use(VueQuillEditor)

Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('mianshiqian')
  if (token || to.path === '/login') {
    next()
  } else if (!token || to.path !== '/login') {
    next({ name: 'login' })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
