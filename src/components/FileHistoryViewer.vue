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
                        <li class="breadcrumb-item active" aria-current="page">File History Browser</li>
                    </ol>
                </nav>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col-md-12">
                <div class="card" style="min-width:100%">
                    <div class="card-body">
                        <div class="form-row">
                            <div class="form-group col-md-2">
                                <label for="inputVersion">历史版本&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a href data-toggle="modal" data-target="#revertModal">
                                        <i class="fa fa-reply" aria-hidden="true"></i>
                                        回滚至
                                    </a>
                                </label>
                                <input type="number" min="1" v-bind:max="parseInt(dbFile.version)" v-model="displayVersion" id="inputVersion" class="form-control" v-on:change="getFile" />
                            </div>
                            <div class="form-group offset-md-5 col-md-2">
                                <label for='sourceSelect'>源(Source)</label>
                                <select id="sourceSelect" class="form-control" v-model="optionA" v-on:change="excuteCompare">
                                    <option>current</option>
                                    <option>history</option>
                                    <option>local</option>
                                </select>
                            </div>
                            <div class="form-group col-md-2">
                                <label for='targetSelect'>目标(Target)</label>
                                <select id="targetSelect" class="form-control" v-model="optionB" v-on:change="excuteCompare">
                                    <option>current</option>
                                    <option>history</option>
                                    <option>local</option>
                                </select>
                            </div>

                        </div>
                        <hr>
                        <div>
                            <div v-html="compareHTML"></div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="revertModal" tabindex="-1" role="dialog" aria-labelledby="revertModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="revertModalLabel">回滚选项(Revert option)</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="option" value="1" v-model="syncSolution" id="optionCheck1" checked>
                            <label class="form-check-label" for="defaultCheck1">
                                将
                                <strong>本地版本(Local)</strong>和
                                <strong>远端最新版本(Current)</strong>都更改为
                                <strong>指定的版本(History:{{historyFile.version}})</strong>
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="option" value="2" v-model="syncSolution" id="optionCheck2">
                            <label class="form-check-label" for="defaultCheck2">
                                将
                                <strong>远端最新版本(Current)</strong>更改为
                                <strong>本地版本(Local)</strong>
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消(Cancel)</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="applySync">应用(Apply)</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import DiffMatchPatch from "diff-match-patch";
let diff2html = require("diff2html").Diff2Html;
export default {
  name: "FileHistoryViewer",

  data() {
    return {
      fid: 0,
      dbFile: { content: null },
      localFile: { content: null },
      historyFile: { content: null },
      compareHTML: "",
      optionA: "current",
      optionB: "history",
      displayVersion: 1,
      syncSolution:"1",

    };
  },
  beforeCreate: function() {},
  created: function() {
    this.fid = this.$route.query.fid;
    this.getDBFile();
  },
  methods: {
    getDBFile: function() {
      let option = {
        id: this.fid
      };
      this.$post("getPrivateFile", option, true, payload => {
        this.dbFile = payload.file;
        this.displayVersion = this.dbFile.version;
      });
    },
    getFile: function() {
      let option = {
        id: this.fid,
        version: parseInt(this.displayVersion)
      };
      this.$post("getHistoryFile", option, true, payload => {
        this.dbFile = payload.currentFile;
        this.historyFile = payload.historyFile;
        if (localStorage.getItem(this.fid.toString())) {
          this.localFile = JSON.parse(
            localStorage.getItem(this.fid.toString())
          );
        } else {
          this.localFile.content = "";
        }
        this.compare("current", "history");
      });
    },
    excuteCompare: function() {
      console.log("OK");
      this.compare(this.optionA, this.optionB);
    },
    compare: function(a, b) {
      let fileA,
        fileB = "";
      switch (a) {
        case "current":
          fileA = this.dbFile.content;
          break;
        case "history":
          fileA = this.historyFile.content;
          break;
        case "local":
          fileA = this.localFile.content;
          break;
      }

      switch (b) {
        case "current":
          fileB = this.dbFile.content;
          break;
        case "history":
          fileB = this.historyFile.content;
          break;
        case "local":
          fileB = this.localFile.content;
          break;
      }

      var unidiff = require("unidiff");
      var diff = unidiff.diffLines(fileA, fileB);
      this.compareHTML = Diff2Html.getPrettyHtml(
        unidiff.formatLines(diff, { aname: a.toString(), bname: b.toString() }),
        {
          inputFormat: "diff",
          showFiles: true,
          matching: "lines",
          outputFormat: "side-by-side"
        }
      );
    },
    applySync: function(){
        if(this.syncSolution === "1"){            
            let option={
                id:this.fid.toString(),
                version:this.historyFile.version
            }
            this.$post('restoreFile',option,true,payload=>{
                this.$toast("远端回滚成功");
                let option2 = {
                    id: this.fid
                };
                this.$post("getPrivateFile", option2, true, payload => {
                    this.dbFile = payload.file;
                    this.displayVersion = this.dbFile.version;
                    localStorage.setItem(this.fid.toString,JSON.stringify(this.dbFile));
                    this.$toast("本地回滚成功");
                    this.$router.push({
                        name: "PrivateFileList"                        
                    });
                });

            });           
        }else{
            let option = {
                id:this.fid,
                permission:this.localFile.permission,
                content:this.localFile.content,
                date:new Date().getTime(),
                version:this.dbFile.version+1
            };
            this.$post('updateFile',option,true,payload=>{
                this.$toast("远端更新成功");
                this.$router.push({
                        name: "PrivateFileList"                        
                });
            });
        }
    }
  }
};
</script>

<style>
/*
 *
 * Diff to HTML (diff2html.css)
 * Author: rtfpessoa
 *
 */

.d2h-wrapper {
  text-align: left;
}

.d2h-file-header {
  padding: 5px 10px;
  border-bottom: 1px solid #d8d8d8;
  background-color: #f7f7f7;
}

.d2h-file-stats {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-left: auto;
  font-size: 14px;
}

.d2h-lines-added {
  text-align: right;
  border: 1px solid #b4e2b4;
  border-radius: 5px 0 0 5px;
  color: #399839;
  padding: 2px;
  vertical-align: middle;
}

.d2h-lines-deleted {
  text-align: left;
  border: 1px solid #e9aeae;
  border-radius: 0 5px 5px 0;
  color: #c33;
  padding: 2px;
  vertical-align: middle;
  margin-left: 1px;
}

.d2h-file-name-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 15px;
}

.d2h-file-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  line-height: 21px;
}

.d2h-file-wrapper {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 1em;
}

.d2h-diff-table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Menlo", "Consolas", monospace;
  font-size: 13px;
}

.d2h-diff-tbody > tr > td {
  height: 20px;
  line-height: 20px;
}

.d2h-files-diff {
  display: block;
  width: 100%;
  height: 100%;
}

.d2h-file-diff {
  overflow-x: scroll;
  overflow-y: hidden;
}

.d2h-file-side-diff {
  display: inline-block;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 50%;
  margin-right: -4px;
  margin-bottom: -8px;
}

.d2h-code-line {
  display: inline-block;
  white-space: nowrap;
  padding: 0 10px;
  margin-left: 80px;
}

.d2h-code-side-line {
  display: inline-block;
  white-space: nowrap;
  padding: 0 10px;
  margin-left: 50px;
}

.d2h-code-line del,
.d2h-code-side-line del {
  display: inline-block;
  margin-top: -1px;
  text-decoration: none;
  background-color: #ffb6ba;
  border-radius: 0.2em;
}

.d2h-code-line ins,
.d2h-code-side-line ins {
  display: inline-block;
  margin-top: -1px;
  text-decoration: none;
  background-color: #97f295;
  border-radius: 0.2em;
  text-align: left;
}

.d2h-code-line-prefix {
  display: inline;
  background: none;
  padding: 0;
  word-wrap: normal;
  white-space: pre;
}

.d2h-code-line-ctn {
  display: inline;
  background: none;
  padding: 0;
  word-wrap: normal;
  white-space: pre;
}

.line-num1 {
  box-sizing: border-box;
  float: left;
  width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 3px;
}

.line-num2 {
  box-sizing: border-box;
  float: right;
  width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 3px;
}

.d2h-code-linenumber {
  box-sizing: border-box;
  position: absolute;
  width: 86px;
  padding-left: 2px;
  padding-right: 2px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.3);
  text-align: right;
  border: solid #eeeeee;
  border-width: 0 1px 0 1px;
  cursor: pointer;
}

.d2h-code-side-linenumber {
  box-sizing: border-box;
  position: absolute;
  width: 56px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.3);
  text-align: right;
  border: solid #eeeeee;
  border-width: 0 1px 0 1px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}

/*
 * Changes Highlight
 */

.d2h-del {
  background-color: #fee8e9;
  border-color: #e9aeae;
}

.d2h-ins {
  background-color: #dfd;
  border-color: #b4e2b4;
}

.d2h-info {
  background-color: #f8fafd;
  color: rgba(0, 0, 0, 0.3);
  border-color: #d5e4f2;
}

.d2h-file-diff .d2h-del.d2h-change {
  background-color: #fdf2d0;
}

.d2h-file-diff .d2h-ins.d2h-change {
  background-color: #ded;
}

/*
 * File Summary List
 */

.d2h-file-list-wrapper {
  margin-bottom: 10px;
}

.d2h-file-list-wrapper a {
  text-decoration: none;
  color: #3572b0;
}

.d2h-file-list-wrapper a:visited {
  color: #3572b0;
}

.d2h-file-list-header {
  text-align: left;
}

.d2h-file-list-title {
  font-weight: bold;
}

.d2h-file-list-line {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  text-align: left;
}

.d2h-file-list {
  display: block;
  list-style: none;
  padding: 0;
  margin: 0;
}

.d2h-file-list > li {
  border-bottom: #ddd solid 1px;
  padding: 5px 10px;
  margin: 0;
}

.d2h-file-list > li:last-child {
  border-bottom: none;
}

.d2h-file-switch {
  display: none;
  font-size: 10px;
  cursor: pointer;
}

.d2h-icon-wrapper {
  line-height: 31px;
}

.d2h-icon {
  vertical-align: middle;
  margin-right: 10px;
  fill: currentColor;
}

.d2h-deleted {
  color: #c33;
}

.d2h-added {
  color: #399839;
}

.d2h-changed {
  color: #d0b44c;
}

.d2h-moved {
  color: #3572b0;
}

.d2h-tag {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 10px;
  margin-left: 5px;
  padding: 0 2px;
  background-color: #fff;
}

.d2h-deleted-tag {
  border: #c33 1px solid;
}

.d2h-added-tag {
  border: #399839 1px solid;
}

.d2h-changed-tag {
  border: #d0b44c 1px solid;
}

.d2h-moved-tag {
  border: #3572b0 1px solid;
}

/*
 * Selection util.
 */

.selecting-left .d2h-code-line,
.selecting-left .d2h-code-line *,
.selecting-right td.d2h-code-linenumber,
.selecting-right td.d2h-code-linenumber *,
.selecting-left .d2h-code-side-line,
.selecting-left .d2h-code-side-line *,
.selecting-right td.d2h-code-side-linenumber,
.selecting-right td.d2h-code-side-linenumber * {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.selecting-left .d2h-code-line::-moz-selection,
.selecting-left .d2h-code-line *::-moz-selection,
.selecting-right td.d2h-code-linenumber::-moz-selection,
.selecting-left .d2h-code-side-line::-moz-selection,
.selecting-left .d2h-code-side-line *::-moz-selection,
.selecting-right td.d2h-code-side-linenumber::-moz-selection,
.selecting-right td.d2h-code-side-linenumber *::-moz-selection {
  background: transparent;
}

.selecting-left .d2h-code-line::selection,
.selecting-left .d2h-code-line *::selection,
.selecting-right td.d2h-code-linenumber::selection,
.selecting-left .d2h-code-side-line::selection,
.selecting-left .d2h-code-side-line *::selection,
.selecting-right td.d2h-code-side-linenumber::selection,
.selecting-right td.d2h-code-side-linenumber *::selection {
  background: transparent;
}
</style>
