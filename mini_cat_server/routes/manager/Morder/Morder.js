var express = require('express');
var router = express.Router();
var JWT = require('jsonwebtoken');
var mysql = require('mysql');
var SECRET = require('../../../secret');
var XLSX = require('xlsx');
var path = require('path')

router.post('/', function (req, res) {
    const token = req.headers.authorization.split(' ')[1];
    let { id } = JWT.verify(token, SECRET.tokensecret);
    const pool = mysql.createPool(SECRET.database);
    const offertime = req.body.offertime;
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        new Promise((resolved, rejected) => {
            connection.query(SECRET.selectbymanager, id, function (err, result) {
                if (err) throw err;
                if (result.length) {
                    console.log('1')
                    resolved();
                } else {
                    console.log('reject0')
                    rejected();
                }
            })
        }).then(() => {
            return new Promise((resolved, rejected) => {
                connection.query(SECRET.selectallbyoffertime, ["%" + offertime + "%"], function (err, Result) {
                    console.log('before-err');
                    if (err) throw err;
                    if (Result.length) {
                        console.log(Result);
                        console.log('2');
                        resolved(Result);
                    } else {
                        console.log('reject1')
                        res.status(200).send({ cont_list: [], message: '所选时间无供应' });
                        console.log('所选时间无供应');
                        rejected();
                    }
                })
            })
        }, () => {
            console.log('reject3')
            res.status(401).send({ message: '管理员信息错误' });
            return Promise.reject();
        }).then((title_list) => {
            console.log(title_list);
            console.log('3')
            var cont_list = []
            for (let item_title of title_list) {
                connection.query(SECRET.selectcount, ["%" + item_title.title + " 备注: " + offertime + "%"], function (err, Res) {
                    if (err) throw err;
                    console.log(item_title.title);
                    console.log(Res)
                    let item = { key: item_title.title, value: Res[0].num };
                    cont_list[cont_list.length] = item;
                    if (cont_list.length === title_list.length) {
                        console.log(cont_list);
                        res.status(200).send({ cont_list });
                    }
                })
            }
        }
        )
        pool.releaseConnection(connection);
    })
})

router.post('/part', function (req, res) {
    const token = req.headers.authorization.split(' ')[1];
    let { id } = JWT.verify(token, SECRET.tokensecret);

})

router.post('/all', function (req, respone) {
    const token = req.headers.authorization.split(' ')[1];
    let { id } = JWT.verify(token, SECRET.tokensecret);
    let pool = mysql.createPool(SECRET.database);
    respone.setHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    console.log(id);
    if (id) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(SECRET.selectbymanager, id, function (err, result) {
                if (err) throw err;
                if (result.length) {
                    connection.query(SECRET.selectallfrombill, function (err, res) {
                        if (err) throw err;
                        let _data_key = ['orderid', 'fund', 'buildtime', 'content', 'userid', 'total_num'];
                        let _headers = ['订单号', '交易金额', '交易时间', '交易内容', '用户id', '商品总数'];
                        let _data = res;
                        let headers = _headers
                            .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
                        let data = _data.map((v, i) => _data_key.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                            .reduce((prev, next) => prev.concat(next)).reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

                        let worksheet = Object.assign({}, headers, data);
                        let outputPos = Object.keys(worksheet);
                        let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

                        let workbook = {
                            SheetNames: ['Sheet1'],
                            Sheets: {
                                'Sheet1': Object.assign({}, worksheet, { '!ref': ref })
                            }
                        };
                        XLSX.writeFile(workbook, './execl_data/o.xlsx');
                        console.log("========>>>>>>>导出文件成功");
                        // respone.sendFile(path.resolve('./execl_data/o.xlsx'));
                        respone.status(200).send({message: 'success'});
                    })
                } else {
                    respone.status(401).send({ message: '用户信息错误' });
                }
            })
        })
    } else {
        respone.status(490).send({ message: '用户信息错误' })
    }
})

module.exports = router;