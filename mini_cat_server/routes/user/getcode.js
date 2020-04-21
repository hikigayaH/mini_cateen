var express = require('express');
var router = express.Router();
var http = require('https')//请求带证书的站点必须用https

router.post('/', function(req, res, next) {
  let code = req.body.code;
  console.log(req.body.code)
  let appid = 'wxf63d3e6e3bf9eeb0';
  let appsercret = '2ad49530825da0528b6d4ef66e75a87b';
  console.log("https://api.weixin.qq.com/sns/jscode2session?appid="+appid+"&secret="+appsercret+"&js_code="+code+"&grant_type=authorization_code")
  http.get("https://api.weixin.qq.com/sns/jscode2session?appid="+appid+"&secret="+appsercret+"&js_code="+code+"&grant_type=authorization_code",function(req,res){
    console.log('已发送请求')
    let data ='';
    req.on("data",function(chunk){
      data += chunk;
    })
    req.on("end",function(){
      let dataParam = JSON.parse(data);
      console.log(dataParam);
    })
  })
});

module.exports = router;
