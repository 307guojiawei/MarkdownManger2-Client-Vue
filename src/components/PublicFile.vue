<template>
    <div>
        <div class="jumbotron">
            <div class="container">
            <h1 class="display-4">Markdown Manager 2</h1>
            <p class="lead">A personal markdown docs management system and online editor based on python Flask, Vue.js & Editor.md</p>
            <hr class="my-4">
            <p><a href="https://github.com/307guojiawei/MarkdownManager2"><i class="fa fa-github" aria-hidden="true"></i> Github repository</a></p>
            <p class="lead">
                <button class="btn btn-outline-primary" role="button" data-toggle="modal" data-target="#registModal">Sign Up</button>
            </p>
            </div>
        </div>
        <div class="container">
            <h1>
                共享的文件
                <small>Public Files</small>
            </h1>
            <hr>
            <div class="row">
                <div v-for="item in fileList" class="card col-lg-3 mx-2 mb-3">
                    <div class="card-body">
                        <h5 class="card-title">{{item.name}}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">作者({{item.ownerId}})</h6>
                        <p class="card-text">版本号:{{item.version}}</p>
                        <button v-on:click="viewFile(item.id)" class="card-link btn btn-outline-primary">查看
                            <small>(view)</small>
                        </button>
                    </div>
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
    methods: {
        viewFile: function(id) {
            this.$router.push({
                name: "markdownViewer",
                query: { fid: id, isPublic: true }
            });
        }
    }
};
</script>