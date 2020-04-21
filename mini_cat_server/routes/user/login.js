var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var JWT = require('jsonwebtoken');
var SECRET = require('../../secret');

router.post('/', function (req, respone, next) {
  let param = req.body;

  let tokendata = JWT.sign({
    id: String(param.userid),
  }, SECRET.tokensecret);

  let pool = mysql.createPool(SECRET.database);//创建连接池

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(SECRET.selectbymanager, [param.userid], function (err, result) {
      if (err) throw err;
      if (result.length) {
        let mpass = bcrypt.compareSync(param.psd, result[0].mpsd);
        // let mpass = (param.psd === result[0].mpsd)
        console.log(mpass);
        if (mpass === true) {
          pool.releaseConnection(connection);
          respone.status(200).send({ manager: 1, mpass, user: result[0], token: tokendata });
          
        } else if (mpass === false) {
          pool.releaseConnection(connection);
          respone.status(422).send({ manager: 1, mpass, message: "密码错误" });
          
        }
      } else {
        connection.query(SECRET.selectbyuserid, [param.userid], function (err, Result) {
          if (err) throw err;
          console.log(Result)
          if (Result.length) {
            let pass = bcrypt.compareSync(param.psd, Result[0].upsd);
            if (pass === true) {
              respone.status(200).send({ manager: 0, pass, user: Result[0], token: tokendata });
              pool.releaseConnection(connection);
            } else if (pass === false) {
              respone.status(422).send({ manager: 0, pass, message: "密码错误" });
              pool.releaseConnection(connection);
            }
          } else {
            pool.releaseConnection(connection);
            respone.status(422).send({ manager: 0, unregister: true, message: "用户未注册" });
          }
        });
      }
    });
  });
});

module.exports = router;