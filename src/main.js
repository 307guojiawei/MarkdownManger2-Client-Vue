// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Toast from './util/Toast/Toast'
import Connector from './util/ErpConnection'

Vue.config.productionTip = false
Vue.use(VueResource);
Vue.use(Toast);
Vue.use(Connector);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    console.log("check auth");
    if (sessionStorage.getItem("token")&&sessionStorage.getItem("token")!="None") {  // 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      alert("请先登录(Please login first)");
      next({
        path: '/publicFile',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});