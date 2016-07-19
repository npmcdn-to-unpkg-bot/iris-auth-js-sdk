# How to use it

```
# node
> var lib = require('./dist/index.js');
undefined
> var testme = new lib.TestMe({token: "sdksdkl"});
undefined
> testme.token
'sdksdkl
```

let authMgr = require('./dist/index.js');

let authMe = new authMgr.AuthManager({"managementApiUrl": "https://iris.xrtc.me/", "appKey": "W2RHeCDQhj0cwTfTkcAJg+U5r8tC0BF"})

authMe.anonymousLogin("Rob", (data) => { console.log(data); }, (error) => { console.log(error); })
