var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var SECRET = require('../../secret');

router.post('/', function (req, res, next) {
  let param = req.body;
  
  const hash = bcrypt.hashSync(req.body.psw_f, 10);//加密用户密码
  console.log(hash);

  let pool = mysql.createPool(SECRET.database);

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    connection.query (SECRET.selectbyuserid, [param.userid], function (err, result, fields) {
      if (err) throw err;
      console.log(result.length);
      if (result.length) {
        res.status(422).send({ isregistered: true });
      } else {
        connection.query (SECRET.insertintouser, [param.userid, hash], function (err, result, fields) {
          if (err) throw err
          res.status(200).send({ success: 1 });
        })
      }
      connection.release();
    });
  });
});

module.exports = router;
