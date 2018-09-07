<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">MdM2</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/publicFile">主页
                <small>(MainPage)</small>
                <span class="sr-only">(current)</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/privateFileList">我的Markdown
                <small>(My md file)</small>
              </router-link>
            </li>
            <li class="nav-item ">
              <router-link class="nav-link" to="/userControl">我的账户
                <small>(My account)</small>
              </router-link>
            </li>
          </ul>

          <button id='btnToggleModal' v-if="!isLogin" class="btn btn-outline-success my-sm-2" data-toggle="modal" data-target="#loginModal" type="submit">登录
            <small>(login)</small>
          </button>
          <button v-if="isLogin" v-on:click="logout" class="btn btn-outline-success my-sm-2" type="submit">登出
            <small>(logout)</small>
          </button>

        </div>
      </div>
    </nav>
    <div class="mainFrame">
      <router-view/>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">登录(Login)</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="textInputUserName">用户名(User Name)</label>
                <input type="text" class="form-control" v-model="loginForm.userName" id="textInputUserName" aria-describedby="textHelp" placeholder="输入用户名(Enter user name)">
                <small id="textHelp" class="form-text text-muted">We'll never share your user name with anyone else.</small>
              </div>
              <div class="form-group">
                <label for="inputPassword">密码(Password)</label>
                <input type="password" class="form-control" v-model="loginForm.password" id="inputPassword" placeholder="输入密码(Enter Password)">
              </div>

            </form>
            <p>没有账号？
              <a href data-dismiss="modal" v-on:click="toggleRegist">现在注册</a>
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消(Cancel)</button>
            <button type="button" v-on:click="login" class="btn btn-primary">确定(Confirm)</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="registModal" tabindex="-1" role="dialog" aria-labelledby="registModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registModalLabel">注册(Regist)</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="textInputUserName">用户名(User Name)</label>
                <input type="text" class="form-control" v-model="registForm.userName" aria-describedby="textHelp" placeholder="输入用户名(Enter user name)">
                <small id="textHelp" class="form-text text-muted">We'll never share your user name with anyone else.</small>
              </div>
              <div class="form-group">
                <label for="inputPassword">密码(Password)</label>
                <input type="password" class="form-control" v-model="registForm.password" placeholder="输入密码(Enter Password)">
              </div>
              <div class="form-group">
                <label for="inputPassword">重复密码(repeat)</label>
                <input type="password" class="form-control" v-model="registForm.password2" placeholder="输入密码(Enter Password)">
              </div>

            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消(Cancel)</button>
            <button type="button" v-on:click="regist" data-dismiss="modal" class="btn btn-primary">确定(Confirm)</button>
          </div>
        </div>
      </div>
    </div>
    <button type="button" id="registBtn" style="display:none" class="btn btn-primary" data-toggle="modal" data-target="#registModal">
      regist
    </button>
  </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            isLogin: false,
            showLoginModal: false,
            loginForm: {
                userName: "",
                password: ""
            },
            registForm: {
                userName: "",
                password: "",
                password2: ""
            }
        };
    },
    created: function() {
        let checkLogin = () => {
            if (
                sessionStorage.getItem("token") &&
                sessionStorage.getItem("token") != "None"
            ) {
                this.isLogin = true;
            } else {
                this.isLogin = false;
            }
        };
        window.onstorage = event => {
            console.log("storage Event");
            this.checkLogin();
        };
        checkLogin();
    },
    methods: {
        logout: function() {
            let token = sessionStorage.getItem("token");
            let content = {
                opr: "logout",
                password: token
            };
            this.$post("auth", content, true, payload => {
                this.$toast("成功登出(Logout Success)");
                this.isLogin = false;
            });
        },
        login: function() {
            let content = {
                opr: "login",
                userName: this.loginForm.userName,
                password: this.loginForm.password
            };
            if (content.userName == "" || content.password == "") {
                this.$toast(
                    "请输入用户名和密码(Please Enter Username and Password)"
                );
                return;
            }
            this.$post("auth", content, false, payload => {
                sessionStorage.setItem("token", payload.token);
                this.isLogin = true;
                $("#btnToggleModal").click();
                this.$toast("登录成功(Login success)");
            });
        },
        regist: function() {
            if (
                this.registForm.userName === "" ||
                this.registForm.password === "" ||
                this.registForm.password2 === ""
            ) {
                this.$toast("字段必须非空");
                return;
            }
            if (this.registForm.password !== this.registForm.password2) {
                this.$toast("密码不相同");
                return;
            }
            let option = {
                userName: this.registForm.userName,
                password: this.registForm.password
            };
            this.$post("regist", option, false, payload => {
                sessionStorage.setItem("token", payload.token);
                this.$toast("注册成功");
                this.$forceUpdate();
                window.location.reload()
            });
        },
        toggleRegist() {
            document.getElementById("registBtn").click();
        }
    }
};
</script>

<style>
.mainFrame {
    margin-top: 1em;
}
</style>
