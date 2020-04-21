var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var JWT = require('jsonwebtoken');
var SECRET = require('../../secret');

router.post('/', function (req, respone, next) {

    const authorization = String(req.headers.authorization);
    const token = authorization.split(' ')[1];

    if (token) {

        const { id } = JWT.verify(token, SECRET.tokensecret);
        const pool = mysql.createPool(SECRET.database);

        const orderid = Number((Math.random(143) * Math.random() * Date.now()).toFixed(0));

        const fund = req.body.total_money.toFixed(2);
        const buildtime = new Date(Date.now());
        let effecttime = new Date();
        let content = '';

        if (buildtime.getHours() >= 15) {
            effecttime.setDate(buildtime.getDate() + 3);
            effecttime.setHours(0);
            effecttime.setMinutes(0);
            effecttime.setSeconds(0);
            effecttime.setMilliseconds(0);
        } else {
            effecttime.setDate(buildtime.getDate() + 2);
            effecttime.setHours(0);
            effecttime.setMinutes(0);
            effecttime.setSeconds(0);
            effecttime.setMilliseconds(0);
        }

        let index = 0;
        for (let item of req.body.cart_list) {
            if (index < (req.body.cart_list.length - 1)) {
                content += (item.title +  " 备注: " + item.offertime + " * " + item.num + " | ");
            } else {
                content = content + (item.title + " 备注: " + item.offertime + " * " + item.num );
            }
            index++;
        }

        const total_num = req.body.total_num;

        console.log(orderid);
        console.log(fund);
        console.log(buildtime);
        console.log(effecttime);
        console.log(content);
        console.log(id);
        console.log(total_num);

        //1、尝试减少余额
        //2、插入订单
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(SECRET.selectbalbyuser, id, function (err, result) {
                if (err) throw err;
                console.log(result);
                let balance = result[0].ubalance;
                console.log(balance);
                if (balance < fund) {
                    pool.releaseConnection(connection);
                    respone.status(200).send({ message: '余额不足，支付失败', success: 0 });
                } else {
                    balance -= fund;
                    connection.query(SECRET.updatebalance, [balance,id], function(err,result){
                        if (err) throw err;
                        console.log("update data");
                        console.log(result);
                    })
                    connection.query(SECRET.insertintobill, [orderid, fund, buildtime, effecttime, content, id, total_num], function (err, result) {
                        if (err) throw err;
                        console.log(result);
                    })
                    pool.releaseConnection(connection);
                    respone.status(200).send({ message: '订单创建成功', success: 1 });
                }
            })
        })
    } else {
        pool.releaseConnection(connection);
        respone.status(401).send({message: "用户未登录"});
    }
})

module.exports = router;