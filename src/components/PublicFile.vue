<template>
    <div class="container">
        <h1>
            共享的文件
            <small>Public Files</small>
        </h1>
        <hr>
        <div class="column">
            <div v-for="item in fileList" class="card col-md-4">
                <div class="card-body">
                    <h5 class="card-title">{{item.name}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">作者({{item.ownerId}})</h6>
                    <p class="card-text">修改时间：{{item.date}}</p>
                    <a v-on:click="viewFile(item.id)" class="card-link">查看
                        <small>(view)</small>
                    </a>
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