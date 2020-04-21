var express = require("express");
var router = express.Router();
var mysql = require('mysql');
var SECRET = require('../../secret');

router.post('/', function (req, respone) {
    let pagenum = req.body.pagenum;
    let pool = mysql.createPool(SECRET.database);
    pool.getConnection(function(err,connection){
        if(err) throw err;
        connection.query(SECRET.selectuser,function(err,result){
            if (err) throw err;
            let member_list = result.slice((pagenum - 1) * 11, pagenum * 11);
            let total_page = result.length % 11 === 0 ? result.length / 11 : parseInt(result.length /11) + 1;
            respone.status(200).send({ member_list, total_page });
            pool.releaseConnection(connection);
        })
    });
})

router.post('/changebalance',function(req,res){
    console.log(req.body);
    let ubalance =  req.body.ubalance;
    let userid = req.body.userid;
    let pool = mysql.createPool(SECRET.database);
    pool.getConnection(function(err,connection){
        if(err) throw err;
        connection.query(SECRET.updatebalance,[ubalance,userid],function(err,result){
            if (err) throw err;
            res.status(200).send({ message: 'ok'});
            pool.releaseConnection(connection);
        })
    });
})

router.post('/deleteuser',function(req,res){
    console.log(req.body);
    let userid = req.body.userid;
    let pool = mysql.createPool(SECRET.database);
    pool.getConnection(function(err,connection){
        if(err) throw err;
        connection.query(SECRET.deleteuser,[userid],function(err,result){
            if (err) throw err;
            res.status(200).send({ message: 'ok'});
            pool.releaseConnection(connection);
        })
    });
})

module.exports = router;