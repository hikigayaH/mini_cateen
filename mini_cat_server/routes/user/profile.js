var express = require('express');
var router = express.Router();
var JWT = require('jsonwebtoken');
var mysql = require('mysql');
var bcrpyt = require('bcrypt');
var SECRET = require('../../secret');

router.post('/',function(req,respone,next){
    console.log(req.headers.authorization);
    const authorization = String(req.headers.authorization);
    const token = authorization.split(' ')[1];
    if(token){
        const {id} = JWT.verify(token,SECRET.tokensecret);
        const pool = mysql.createPool(SECRET.database);
        pool.getConnection(function(err,connection){
            if (err) throw err;
            connection.query(SECRET.selectbyuserid,id,function(err, result){
                if (err) throw err;
                respone.status(200).send(result[0]);
            })
            connection.release();
        })
    }else{
        respone.status(401).send({message: "用户未登录"});
    }
})

router.post('/account', function (req, res) {
    console.log(req.body);
    const paramdata = req.body;
    const userid = paramdata.userid;
    const psw_o = paramdata.psw_o;
    const psw_n = bcrpyt.hashSync(paramdata.psw_n, 10);
    const pool = mysql.createPool(SECRET.database);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        if (userid) {
            connection.query(SECRET.selectbyuserid, userid, function (err, result) {
                if (err) throw err;
                if (result.length !== 0) {
                    console.log(result)
                    let pass = bcrpyt.compareSync(psw_o, result[0].upsd);
                    if (pass === true) {
                        connection.query(SECRET.updatepassword, [psw_n, userid], function (err, result) {
                            if (err) throw err;
                            if (result) {
                                res.status(200).send({ success: 1, message: '密码更改成功' });
                            }
                        })
                    } else {
                        console.log('原密码错误');
                        res.status(422).send({ success: 0, message: '输入信息错误' });
                    }
                }
            })
        } else {
            res.status(422).send({ message: '无userid' });
        }
        connection.release();
    })
})

router.post('/personal',function(req,res){
    const authorization = String(req.headers.authorization);
    const token = authorization.split(' ')[1];
    const {id} = JWT.verify(token,SECRET.tokensecret);
    const username = req.body.uname;
    let usergender = 0;
    if(req.body.ugender === '女'){
        usergender = 0;
    }else{
        usergender = 1;
    }
    const pool = mysql.createPool(SECRET.database);
    pool.getConnection(function(err,connection){
        if (err) throw err;
        connection.query(SECRET.updateinfobyid,[username,usergender,id],function(err, result){
            if (err) throw err;
            res.status(200).send({message: '修改成功'});
        })
        connection.release();
    })
})

module.exports = router;