var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrpyt = require('bcrypt');
var SECRET = require('../../secret');

router.post('/', function (req, res) {
    const paramdata = req.body;
    console.log(req.body);
    const id = paramdata.managerid;
    const psw_o = paramdata.psw_o;
    const psw_n = bcrpyt.hashSync(paramdata.psw_n, 10);
    const pool = mysql.createPool(SECRET.database);
    console.log(psw_n)
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        if (id) {
            connection.query(SECRET.selectbymanager, id, function (err, result) {
                if (err) throw err;
                if (result.length !== 0) {
                    console.log(result)
                    let pass = bcrpyt.compareSync(psw_o, result[0].mpsd);
                    // let pass = (psw_o === result[0].mpsd);
                    if (pass === true) {
                        connection.query(SECRET.updatemanagerpassword, [psw_n, id], function (err, result) {
                            if (err) throw err;
                            console.log('密码更改成功');
                            if (result) {
                                res.status(200).send({ success: 1, message: '密码更改成功' });
                            }
                        })
                    } else {
                        console.log('原密码错误');
                        res.status(402).send({ success: 0, message: '输入信息错误' });
                    }
                }
            })
        } else {
            res.status(422).send({ message: '无userid' });
        }
        pool.releaseConnection(connection);
    })
})

module.exports = router;