import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import PublicFile from '@/components/PublicFile'
import MarkdownViewer from '@/components/MarkdownViewer'
import PrivateFileList from '@/components/PrivateFileList'
import MarkdownEditor from '@/components/MarkdownEditor'
import FileHistoryViewer from '@/components/FileHistoryViewer'
import UserControl from '@/components/UserControl'

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
    },
    {
      path:'/privateFileList',
      name:"PrivateFileList",
      meta:{
        requireAuth: true
      },
      component:PrivateFileList
    },
    {
      path:'/markdownEditor',
      name:'markdownEditor',
      meta:{
        requireAuth: true
      },
      component:MarkdownEditor
    },
    {
      path:'/fileHistoryViewer',
      name:'fileHistoryViewer',
      meta:{
        requireAuth: true
      },
      component: FileHistoryViewer
    },{
      path:'/userControl',
      name:"userControl",
      meta:{
        requireAuth:true
      },
      component:UserControl
    }
  ]
})
