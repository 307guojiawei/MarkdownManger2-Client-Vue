<template>
    <div class="container">
        <h1>
            共享的文件
            <small>Public Files</small>
        </h1>
        <hr>
        <div class="row">
            <div v-for="item in fileList"  class="card col-lg-3 mx-2 mb-3">
                <div class="card-body">
                    <h5 class="card-title">{{item.name}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">作者({{item.ownerId}})</h6>
                    <p class="card-text">版本号:{{item.version}}</p>
                    <button  v-on:click="viewFile(item.id)" class="card-link btn btn-outline-primary">查看
                        <small>(view)</small>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      fileList: [{}]
    };
  },
  beforeCreate: function() {
    this.$post("getPublicList", null, false, payload => {
      this.fileList = payload.fileList;
    });
  },
  methods:{
      viewFile: function(id){
          this.$router.push({name:'markdownViewer',query:{fid:id,isPublic:true}});
      }
  }
};
</script>