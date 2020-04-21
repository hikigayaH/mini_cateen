var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var SECRET = require('../../secret');

router.post('/catebar', function (req, res) {
    const { offertime, curcate } = req.body;

    let pool = mysql.createPool(SECRET.database);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(SECRET.selectbyoffertime, ["%" + offertime + "%", curcate], function (err, Cont_result) {
            if (err) throw err;
            console.log(Cont_result);
            for (let item of Cont_result) {
                if (item.description) {
                    item.description = item.description.split('、');
                }
            }
            console.log(Cont_result);
            res.status(200).send({
                cont_list: Cont_result
            })
        })
    })
})

router.post('/offertime', function (req, res) {
    const { offertime } = req.body;
    console.log(typeof (offertime))
    let pool = mysql.createPool(SECRET.database);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(SECRET.selectdistinctcate, "%" + offertime + "%", function (err, Cate_result) {
            if (err) throw err;
            console.log(Cate_result)
            let cate_list = [];
            for (let item of Cate_result) {
                if (item.category) {
                    cate_list.push(item.category);
                }
            }

            connection.query(SECRET.selectbyoffertime, ["%" + offertime + "%", cate_list[0]], function (err, Cont_result) {
                if (err) throw err;
                console.log(Cont_result);
                for (let item of Cont_result) {
                    if (item.description) {
                        item.description = item.description.split('、');
                    }
                }
                console.log(Cont_result);
                res.status(200).send({
                    cont_list: Cont_result,
                    cate_item: cate_list
                })
            })
        })
    })
})

module.exports = router;