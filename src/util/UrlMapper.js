export function mapUrl(inputUrl){
        
        // var prefix = "http://localhost:5000";   //调试
        
        var prefix = "http://"+window.location.host;    //部署

        var suffix = "";

        var m = new Map([
            //模板：
            //['',''],
            ['getRoot',''],
            ['getPublicList','/file/public/list'],
            ['getPublicFile','/file/public/getFile'],
            ['getPrivateList','/file/private/list'],
            ['getPrivateFile','/file/private/getFile'],
            ['addFile','/file/private/addFile'],
            ['updateFile','/file/private/updateFile'],
            ['deleteFile','/file/private/deleteFile'],
            ['uploadImg','/file/private/uploadImg'],
            ['auth','/auth'],
            ['regist','/regist'],
            ['getHistoryFile','/file/private/getHistoryFile'],
            ['restoreFile','/file/private/restoreFile'],
            ['changePassword','/changePassword']
        ]);
        var  res = prefix+m.get(inputUrl)+suffix;
        return res;
};
