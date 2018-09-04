<template>
  <div id="editor-md" class="main-editor">
    <textarea v-model="content"></textarea>
  </div>
</template>

<script>
  import $script from 'scriptjs';

  export default {
    name: 'EditDocMainEditor',
    props: {
      editorPath: {
        type: String,
        default: '/static/editor.md/',
      },
      editorConfig: {
        type: Object,
        default() {
          return {
            width: '88%',
            height: 530,
            path: '/static/editor.md/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
            codeFold: true,
            saveHTMLToTextarea: true,
            searchReplace: true,
            htmlDecode: 'style,script,iframe|on*',
            emoji: true,
            taskList: true,
            tocm: true,                  // Using [TOCM]
            tex: true,                   // 开启科学公式TeX语言支持，默认关闭
            flowChart: true,             // 开启流程图支持，默认关闭
            sequenceDiagram: true,       // 开启时序/序列图支持，默认关闭,
            imageUpload: true,
            imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
            imageUploadURL: 'examples/php/upload.php',
            onload: () => {
              console.log('onload', this);
            },
          };
        },
      },
      content:{
        type: String,
        default: '# Helloworld1',
      },
    },
    data() {
      return {
        instance: null,
      };
    },
    created() {
    },
    mounted() {
      // async loading js dependencies
      // editormd depdend on jquery and zepto
      $script([
        `https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js`,
        `https://cdn.bootcss.com/zepto/1.0rc1/zepto.min.js`,
      ], () => {
        $script(`${this.editorPath}js/editormd.min.js`, () => {
          this.initEditor();
        });
      });
    },
    beforeDestroy() {
    },
    methods: {
      initEditor() {
        // eslint-disable-next-line
        this.$nextTick((editorMD = window.editormd) => {
          if (editorMD) {
            // Vue 异步执行 DOM 更新，template 里面的 script 标签异步创建
            // 所以，只能在 nextTick 里面初始化 editor.md
            this.instance = editorMD('editor-md', this.editorConfig);
          }
        });
      },
    },
  };
</script>

<style scoped>
  .main-editor{
    width: 100%;
    height: 100%;
    margin-top: 100px;
  }
    
</style>