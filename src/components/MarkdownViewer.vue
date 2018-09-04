<template>
    <div class="container">
        <h1>{{file.name}}</h1>
        <hr>
        <div class="column">
            <div id="doc-content" class="col-md-12">
            </div>
        </div>
        <!-- <edit-doc-main-editor></edit-doc-main-editor> -->
    </div>
</template>
<script>
//import EditDocMainEditor from '@/components/Editormd'
import $script from "scriptjs";
import marked from "marked";

export default {
  name: "MarkdownViewer",
  //components:{EditDocMainEditor},
  beforeCreate: function() {
    let fid = this.$route.query.fid;
    if (this.$route.query.isPublic) {
      let option = {
        id: fid
      };
      this.$post("getPublicFile", option, false, payload => {
        this.file = payload.file;
        this.compiledMarkdown();
      });
    } else {
      let option = {
        id: fid
      };
      this.$post("getPrivateFile", option, true, payload => {
        this.file = payload.file;
        this.compiledMarkdown();
      });
    }
  },
  data() {
    return {
      file: {
        content: "# HelloWorld-GJW"
      },
      compiledHTML: ""
    };
  },
  methods: {
    compiledMarkdown: function() {
      $script(
        [
          `https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js`,
          `https://cdn.bootcss.com/zepto/1.0rc1/zepto.min.js`,
          '/static/editor.md/lib/marked.min.js',
          '/static/editor.md/lib/flowchart.min.js',
          '/static/editor.md/lib/prettify.min.js',
          '/static/editor.md/lib/raphael.min.js',
          '/static/editor.md/lib/sequence-diagram.min.js',
          '/static/editor.md/lib/underscore.min.js',
          '/static/editor.md/lib/jquery.flowchart.min.js',

        ],
        () => {
          $script(`/static/editor.md/js/editormd.js`, () => {
            editormd.markdownToHTML("doc-content", {
              //注意：这里是上面DIV的id
              markdown: this.file.content,
              htmlDecode: "style,script,iframe",
              emoji: false,
              taskList: true,
              tex: true, // 默认不解析
              flowChart: false, // 默认不解析
              sequenceDiagram: false, // 默认不解析
              codeFold: true,
              path: "/static/editor.md/lib/"
            });
          });
        }
      );
    }
  }
};
</script>
