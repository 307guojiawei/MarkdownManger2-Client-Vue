export function mapUrl(inputUrl){
        
        var prefix = "http://localhost:5000";        

        var suffix = "";

        var m = new Map([
            //模板：
            //['',''],
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
            ['restoreFile','/file/private/restoreFile']
        ]);
        var  res = prefix+m.get(inputUrl)+suffix;
        return res;
};
