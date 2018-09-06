import * as UrlMapper from './UrlMapper.js';
import "vue";

const Connector = {};
Connector.install = function (Vue){
    Vue.prototype.$post = function(url,  object, requireAuth,callback){
        if(requireAuth){
            object.token = sessionStorage.getItem('token');
        }
        this.$http.post(UrlMapper.mapUrl(url), object,{"emulateJSON":true}).then((response)=>{

            if(response.data.code == 4001)
            {
                callback(response.data.payload);
            }else
            {
                //全局错误处理策略
                switch(response.data.code){
                    case 4002://用户未登录
                        if(response.data.msg === "login first"){
                            sessionStorage.removeItem('token');
                        }
                        break;
                    case 4003://session变化
                        if(response.data.payload.token === "None"){
                            sessionStorage.removeItem('token');
                        }else{
                            sessionStorage.setItem("token",response.payload.token);
                        }                        
                        callback(response);
                        break;
                }
                this.$toast(response.data.msg);
            }
        },(response)=>{
            console.log("fail");
            console.log(response);
            
            this.$toast("服务器连接中断");          

        });
    }
}
export default Connector;
