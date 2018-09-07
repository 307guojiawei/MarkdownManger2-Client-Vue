<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <a href="javascript:history.go(-1)">
                                <i class="fa fa-arrow-left" aria-hidden="true"></i>Back</a>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">{{file.name}}</li>
                    </ol>
                </nav>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-3">
                <button class="btn btn-sm btn-outline-primary" v-on:click="checkHistoryVersion">
                    <i class="fa fa-history" aria-hidden="true"></i>查看历史版本
                    <small>check history version</small>
                </button>
            </div>
            <div class="col-md-2 ml-auto">
                <button class="btn btn-sm btn-outline-primary" v-if="!autoSync" v-on:click="sync">同步Sync</button>
            </div>
            <div class="col-md-3 ">
                <button class="btn btn-sm btn-outline-danger" v-if="!autoSync" v-on:click="toggleAutoSync">自动同步AutoSync:关闭</button>
                <button class="btn btn-sm btn-outline-success" v-if="autoSync" v-on:click="toggleAutoSync">自动同步AutoSync:开启</button>
            </div>

        </div>
        <div v-if="autoSync" class="progress" style="max-height:1px;margin-top:1rem;margin-bottom:1rem">
            <div v-bind:class="{'progress-bar':true,'bg-success':hasNew,'bg-primary':!hasNew}" role="progressbar" v-bind:aria-valuenow="counter" aria-valuemin="0" aria-valuemax="200" v-bind:style="{'width': (counter/2).toString()+'%'}"></div>
        </div>
        <hr v-if="!autoSync">

        <div class="row">

            <edit-doc-main-editor :content="file.content" :height="height" v-on:contentChange="contentChangeHandler"></edit-doc-main-editor>
        </div>
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
            content: "",
            height: (window.screen.availHeight * 0.9).toString(),
            autoSync: false,
            hasNew: false,
            counter: 0,
            lock: false
        };
    },
    beforeCreate: function() {
        let fid = this.$route.query.fid;
        let content = {
            id: fid
        };
        this.$post("getPrivateFile", content, true, payload => {
            this.file = payload.file;
            this.content = this.file.content;
            //console.log(this.file);
        });
    },
    created: function() {
        setInterval(this.autoSyncHandler, 100);
    },
    methods: {
        checkHistoryVersion: function() {
            this.$router.push({
                name: "fileHistoryViewer",
                query: { fid: this.$route.query.fid }
            });
        },
        contentChangeHandler: function(content) {
            let handle = () => {
                this.content = content;
                if (this.file.content === content) {
                    //内容没有变化
                    this.hasNew = false;
                } else {
                    this.hasNew = true;
                }
            };
            if (this.lock) {
                setTimeout(handle, 50); //防止出现脏读
            } else {
                handle();
            }
        },
        toggleAutoSync: function() {
            this.autoSync = !this.autoSync;
        },
        autoSyncHandler: function() {
            if (!this.autoSync) {
                return;
            }
            if (this.counter >= 200) {
                //每20秒进行一次sync检查(如果内容有变化则更新)

                this.sync();

                this.counter = 0;
            } else {
                this.counter++;
            }
        },
        sync: function() {
            if (!this.hasNew) return;
            let option = {
                id: this.$route.query.fid,
                permission: this.file.permission,
                version: this.file.version + 1,
                content: this.content,
                date: new Date().getTime()
            };
            this.$post(
                "updateFile",
                option,
                true,
                payload => {
                    this.lock = true;
                    this.$toast("同步成功");
                    this.hasNew = false;
                    this.file.version++;
                    this.file.content = this.content;
                    localStorage.setItem(
                        this.$route.query.fid.toString(),
                        JSON.stringify(this.file)
                    );
                    this.lock = false;
                },
                err => {
                    if (err == 4500) {
                        this.autoSync = false;
                        alert(
                            "本地版本落后于远端版本，自动更新已暂停。请访问wiki获取进一步帮助"
                        );
                    }
                }
            );
        }
    }
};
</script>
