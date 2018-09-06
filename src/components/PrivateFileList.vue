<template>
    <div class="container">

        <h1>个人文件
            <small>Private File</small>
        </h1>

        <hr>
        <div class="row">
            <div v-for="item in fileList" class="card col-lg-3 mx-2 mb-3">
                <div class="card-body">
                    <h5 class="card-title">{{item.name}}</h5>
                    <hr>

                    <p data-toggle="tooltip" data-placement="right" title="点击以改变权限(click to change permission)">权限(Permission):
                        <span v-on:click="togglePermission(item.id,item.permission)" class="badge badge-secondary">{{item.permission}}</span>
                    </p>
                    <p>
                        <a data-toggle="modal" v-bind:data-target="'#'+item.id+'Modal'" data-placement="right" title="点击以查看文件信息(click to check file info)">状态(Status):
                            <span v-if="item.status=='OK' " class="badge badge-success">{{item.status}}</span>
                            <span v-if="item.status!='OK' " class="badge badge-danger">{{item.status}}</span>
                        </a>
                    </p>

                    <br>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <button v-on:click="viewFile(item.id)" class="form-control card-link btn btn-outline-secondary">查看
                                <small>(view)</small>
                            </button>
                        </div>
                        <div class="form-group col-md-6">
                            <button v-on:click="editFile(item.id)" class="form-control card-link btn btn-outline-primary">编辑
                                <small>(edit)</small>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal fade" v-bind:id="item.id+'Modal'" tabindex="-1" role="dialog" v-bind:aria-labelledby="item.id+'ModalLabel'" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" v-bind:id="item.id+'ModalLabel'">{{item.name}}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>当前版本：{{item.version}}</p>
                                <hr>
                                <h3>变更历史</h3>
                                <button class="btn btn-outline-info" v-on:click="getFileHistory(item.id)" data-dismiss="modal">查看(Check)</button>
                                <hr>
                                <button type="button" v-on:click="deleteFile(item.id)" class="btn btn-outline-danger" data-dismiss="modal">删除
                                    <small>(Delete)</small>
                                </button>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭(Close)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <hr>
        <div class="row">
            <button id="toggleAddFileModalBtn" type="button" class="btn btn-outline-secondary btn-lg btn-block" data-toggle="modal" data-target="#addFileModal">新建文件
                <small>(New File)</small>
            </button>
        </div>

        <div class="modal fade" id="addFileModal" tabindex="-1" role="dialog" aria-labelledby="eaddFileModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addFileModalLabel">新建文件(Create File)</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="InputFileName">文件名
                                    <small>(FileName)</small>
                                </label>
                                <input type="text" v-model="addFile.name" class="form-control" id="InputFileName" placeholder="输入文件名">
                            </div>
                            <div class="form-group">
                                <label for="permissionSelect">文件权限选择
                                    <small>(Permission)</small>
                                </label>
                                <select class="form-control" v-model="addFile.permission" id="permissionSelect">
                                    <option>public</option>
                                    <option>private</option>
                                </select>
                            </div>

                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭(Close)</button>
                        <button type="button" v-on:click="createFile" class="btn btn-primary">保存(Save)</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  name: "PrivateFileList",

  data() {
    return {
      fileList: [
        {
          id: ""
        }
      ],
      addFile: {
        name: "",
        permission: "public"
      }
    };
  },
  beforeCreate: function() {},
  created: function() {
    //   $('[data-toggle="tooltip"]').tooltip()
    this.getPrivateList();
  },
  methods: {
    getPrivateList: function() {
      let option = {};
      this.$post("getPrivateList", option, true, payload => {
        this.fileList = payload.fileList;
      });
    },
    togglePermission: function(id, permission) {
      let file = null;
      this.fileList.forEach(element => {
        if (element.id == id) {
          file = element;
        }
      });
      if (file.permission == "public") {
        file.permission = "private";
      } else {
        file.permission = "public";
      }
      let option = {
        id: file.id,
        permission: file.permission,
        content: "",
        date: new Date().getTime(),
        version: file.version + 1
      };
      this.$post("updateFile", option, true, payload => {
        this.$toast("修改权限成功(Change permission success)");
        this.getPrivateList();
      });
    },
    viewFile: function(id) {
      this.$router.push({
        name: "markdownViewer",
        query: { fid: id, isPublic: false }
      });
    },
    editFile: function(id) {
      this.$router.push({
        name: "markdownEditor",
        query: { fid: id }
      });
    },
    deleteFile: function(fid) {
      let option = {
        id: fid
      };
      this.$post("deleteFile", option, true, payload => {
        this.$toast("删除文件成功");
        this.getPrivateList();
      });
    },
    createFile: function() {
      let option = {
        name: this.addFile.name,
        permission: this.addFile.permission,
        content: "",
        date: new Date().getTime()
      };
      this.$post("addFile", option, true, payload => {
        this.$toast("创建文件成功(Create file success)");
        this.getPrivateList();
        document.getElementById("toggleAddFileModalBtn").click();
      });
    },
    getFileHistory: function(id) {      
      this.$router.push({
        name: "fileHistoryViewer",
        query: { fid: id }
      });
    }
  }
};
</script>
