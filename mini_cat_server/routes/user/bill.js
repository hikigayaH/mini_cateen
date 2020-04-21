var express = require('express');
var router = express.Router();
var JWT = require('jsonwebtoken');
var mysql = require('mysql');
var SECRET = require('../../secret');

router.post('/', function (req, respone, next) {
    const authorization = String(req.headers.authorization);
    const token = authorization.split(' ')[1];
    const pagenum = req.body.pagenum;

    if (token) {
        const { id } = JWT.verify(token, SECRET.tokensecret);
        const pool = mysql.createPool(SECRET.database);
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            //orderid,fund,buildtime,effecttime,content,userid,total_num
            connection.query(SECRET.selectfrombillbyuserid, [id], function (err, result) {
                if (err) throw err;
                let order_list = result.slice(0,(pagenum+1)*5);
                respone.status(200).send(order_list);
            })
            pool.releaseConnection(connection);
        });
    } else {
        respone.status(401).send({message: "用户未登录"});
    }
})

router.post('/cancelbill',function(req,res){
    const orderid = req.body.orderid;
    const authorization = String(req.headers.authorization);
    const token = authorization.split(' ')[1];
    if (token) {
        const { id } = JWT.verify(token, SECRET.tokensecret);
        const pool = mysql.createPool(SECRET.database);
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            let refund = 0;
            let userid = '';
            connection.query(SECRET.selectbillbyorderid, [orderid], function(err,result){
                if(err) throw err;
                console.log(result);
                console.log(id);
                refund = result[0].fund;
                userid = result[0].userid;
            if(userid === id){
                connection.query(SECRET.deletebillbyorderid, [orderid], function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    if(result.affectedRows === 1){
                        connection.query(SECRET.selectbalbyuser, [id], function(err, result){
                            if(err) throw err;
                            let ubalance = result[0].ubalance;
                            ubalance += refund;
                            connection.query(SECRET.updatebalance, [ubalance,id],function(err,result){
                                if(err) throw err;
                                if(result.affectedRows === 1){
                                    res.status(208).send({message: '删除成功'})
                                }
                            })
                        })
                    }else{
                        res.status(517).send({message: "无此订单"});
                    }
                })
            }else{
                res.status(600).send({message: 'unkown'})
            }
        })
            pool.releaseConnection(connection);
        });
    } else {
        res.status(401).send({message: "用户未登录"});
    }
})

module.exports = router;