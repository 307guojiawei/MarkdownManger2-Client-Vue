<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4 mx-auto my-auto">
                <div class="card">
                    <div class="card-body">
                        <form>
                            <div class="form-group">
                                <label for="oldPass">旧密码(Old Password)</label>
                                <input v-model="oldPass" type="password" id="oldPass" class="form-control" placeholder="输入密码(Input password)"/>
                            </div>
                            <div class="form-group">
                                <label for="newPass">新密码(New Password)</label>
                                <input v-model="newPass" type="password" id="newPass" class="form-control" placeholder="输入密码(Input password)"/>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-outline-primary" v-on:click="modifyPassword">修改(Modify)</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"UserControl",
    data (){
        return{
            oldPass:"",
            newPass:""
        }
    },
    methods:{
        modifyPassword:function(){
            let option={
                oldPassword:this.oldPass,
                newPassword:this.newPass
            };
            this.$post("changePassword",option,true,payload=>{
                this.$toast("修改成功");
                this.oldPass = "";
                this.newPass = "";
            });
        }
    }
};
</script>
