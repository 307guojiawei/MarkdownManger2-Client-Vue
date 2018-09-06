<template>
    <div>
        <edit-doc-main-editor :content="file.content" :height="height" ></edit-doc-main-editor>
    </div>
</template>
<script>
import EditDocMainEditor from "@/components/Editormd";
export default {
  name: "MarkdownEditor",
  components: { EditDocMainEditor },
  data() {
    return {
      file: {},
      height:(window.screen.availHeight*0.9).toString()
    };
  },
  beforeCreate: function() {
    let fid = this.$route.query.fid;
    let content = {
      id: fid
    };
    this.$post("getPrivateFile", content, true, payload => {
      this.file = payload.file;
      console.log(this.file);
    });   
       
    
  }
};
</script>
