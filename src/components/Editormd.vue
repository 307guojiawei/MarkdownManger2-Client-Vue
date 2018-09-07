<template>
    <div style="width:100%">
        <div id="editor-md" class="main-editor">
            <textarea id='mdContent' v-model="content"></textarea>
        </div>
        <div id="uploadImgBox" style="display:hidden" v-on:click="uploadImgHandler"></div>
        <div id="resultMsgBox" style="display:hidden"></div>
        <div id="imgDialogBtn"></div>
    </div>
</template>

<script>
import $script from "scriptjs";
import * as UrlMapper from "@/util/UrlMapper";

export default {
    name: "EditDocMainEditor",
    props: {
        editorPath: {
            type: String,
            default: "/static/editor.md/"
        },
        height: {
            type: String,
            default: "100%"
        },
        editorConfig: {
            type: Object,
            default() {
                return {
                    width: "100%",
                    height: this.height,
                    markdown: this.content,
                    path: "/static/editor.md/lib/", // Autoload modules mode, codemirror, marked... dependents libs path
                    codeFold: true,
                    saveHTMLToTextarea: true,
                    searchReplace: true,
                    htmlDecode: "style,script,iframe|on*",
                    emoji: true,
                    taskList: true,
                    tocm: true, // Using [TOCM]
                    tex: true, // 开启科学公式TeX语言支持，默认关闭
                    flowChart: true, // 开启流程图支持，默认关闭
                    sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
                    imageUpload: true,
                    imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                    imageUploadURL: UrlMapper.mapUrl("uploadImg"),
                    onload: () => {
                        console.log("onload", this);
                    }
                };
            }
        },
        content: {
            type: String,
            default: "# Helloworld1"
        }
    },
    data() {
        return {
            instance: null,
            dataTarget: null
        };
    },
    created() {
        setTimeout(() => {
            let target = document.getElementById("mdContent");
            this.dataTarget = target;
            let editor = document.getElementById("editor-md");
            editor.onkeypress = this.contentChangeHanler;
            editor.onkeydown = this.contentChangeHanler;
            editor.onmousedown = this.contentChangeHanler;
            editor.ondrop = this.dropImageHandler;
            document.ondragover = function(e) {
                //console.log("drag over");
                e.stopPropagation();
                e.preventDefault();
            };
            editor.ondragover = function(e) {
                //console.log("editor drag over");
                e.stopPropagation();
                e.preventDefault();
            };
        }, 1000);
    },
    mounted() {
        // async loading js dependencies
        // editormd depdend on jquery and zepto
        $script(
            [
                `https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js`,
                `https://cdn.bootcss.com/zepto/1.0rc1/zepto.min.js`
            ],
            () => {
                $script(`/static/editor.md/editormd.js`, () => {
                    this.initEditor();
                });
            }
        );
    },
    beforeDestroy() {},
    methods: {
        initEditor() {
            // eslint-disable-next-line
            this.$nextTick((editorMD = window.editormd) => {
                if (editorMD) {
                    // Vue 异步执行 DOM 更新，template 里面的 script 标签异步创建
                    // 所以，只能在 nextTick 里面初始化 editor.md
                    this.instance = editorMD("editor-md", this.editorConfig);
                }
            });
        },
        contentChangeHanler: function(e) {
            this.$emit("contentChange", this.dataTarget.value);
        },
        uploadImgHandler: function() {
            let inputFileBox = document.getElementById("imgUploadFileInput");
            let file = inputFileBox.files[0];

            var formData = new FormData();
            this.imageUploader(file, url => {
                let returnMsg = document.getElementById("resultMsgBox");
                returnMsg.innerHTML = UrlMapper.mapUrl("getRoot") + url;
                returnMsg.click();
            });
            /*
            formData.append("token", sessionStorage.getItem("token"));
            formData.append("data", file);
            // specify Content-Type, with formData as well
            this.$http
                .post(UrlMapper.mapUrl("uploadImg"), formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then(
                    function(res) {
                        res.json().then(function(result) {
                            let url = result.payload.url;
                            let returnMsg = document.getElementById(
                                "resultMsgBox"
                            );
                            returnMsg.innerHTML =
                                UrlMapper.mapUrl("getRoot") + url;
                            returnMsg.click();
                            console.log(result);
                        });
                    },
                    function(res) {
                        console.log(res.body);
                    }
                );*/
        },
        imageUploader: function(file, callback) {
            var formData = new FormData();
            formData.append("token", sessionStorage.getItem("token"));
            formData.append("data", file);
            // specify Content-Type, with formData as well
            this.$http
                .post(UrlMapper.mapUrl("uploadImg"), formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then(
                    function(res) {
                        res.json().then(function(result) {
                            let url = result.payload.url;
                            callback(url);
                        });
                    },
                    function(res) {
                        console.log(res.body);
                    }
                );
        },
        dropImageHandler: function(e) {
            e.stopPropagation();
            e.preventDefault();
            let file = e.dataTransfer.files[0];
            document.getElementById("imgDialogBtn").click();
            this.imageUploader(file,(url)=>{
                let returnMsg = document.getElementById("resultMsgBox");
                returnMsg.innerHTML = UrlMapper.mapUrl("getRoot") + url;
                returnMsg.click();
            });
            
        }
    }
};
</script>

<style scoped>
.main-editor {
    width: 100%;
    height: 100%;
    margin-top: 0px;
}
</style>