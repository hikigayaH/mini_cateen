var express = require('express');
var router = express.Router();
var JWT = require('jsonwebtoken');
var mysql = require('mysql');
var SECRET = require('../../secret');

router.post('/',function(req,res){
    console.log(req.headers);
    const token = String(req.headers.authorization).split(' ')[1];
    const { id } = JWT.verify(token,SECRET.tokensecret);
    const pool = mysql.createPool(SECRET.database);
    if(token){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            connection.query(SECRET.selectbymanager,id,function(err,result){
                if(err) throw err;
                if(result.length){
                    res.status(200).send({ success: 1, user: result[0] });
                }
                else{
                    res.status(401).send({ success: 0, message: 'no id'})
                }
            })
            pool.releaseConnection(connection);
        })
    }else{
        console.log('>>>>>>-------no id');
        res.status(401).send({message: 'error'})
    }
})

module.exports= router;