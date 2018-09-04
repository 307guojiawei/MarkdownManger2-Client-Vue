import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import PublicFile from '@/components/PublicFile'
import MarkdownViewer from '@/components/MarkdownViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/publicFile'
    },
    {
      path: '/publicFile',
      name:'publicFile',
      meta:{
        requireAuth: false
      },
      component:PublicFile
    },
    {
      path: '/markdownViewer',
      name:'markdownViewer',
      meta:{
        requireAuth: false
      },
      component:MarkdownViewer
    }
  ]
})
