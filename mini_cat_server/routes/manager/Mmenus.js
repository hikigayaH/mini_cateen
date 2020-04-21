var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var SECRET = require('../../secret');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var URL = require('url');
var querystring = require('querystring');

router.post('/', function (req, respone) {
    const pagenum = req.body.pagenum;
    const pool = mysql.createPool(SECRET.database);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(SECRET.selectallmenus, function (err, result) {
            if (err) throw err;
            let menus_list = result.slice((pagenum - 1) * 9, pagenum * 9);
            let total_page = result.length % 9 === 0 ? result.length / 9 : parseInt(result.length / 9) + 1;
            respone.status(200).send({ menus_list, total_page });
        })
        pool.releaseConnection(connection);
    });
})

router.post('/addmenus', function (req, res) {
    let pool = mysql.createPool(SECRET.database);
    let now = new Date();
    let newdir = path.resolve(__dirname + "../../../public/images/" +
        String(now.valueOf() + '/'));
    fs.mkdirSync(newdir, { recursive: true });
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = newdir;
    form.keepExtensions = true;

    form.parse(req, function (err, field, files) {
        if (err) throw err;
        console.log(files);
        let Savepath = files.menus_images.path.split('images')[1];
        let Pathparam = Savepath.split('\\');
        let query = String('dir=' + Pathparam[1] + '&name=' + Pathparam[2]);
        console.log(query);
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            // (foodid,title,description,price,url,foffertime,category)
            connection.query(SECRET.selectbyfoodid, field.number, function (err, result) {
                if (err) throw err;
                if (result.length === 0) {
                    connection.query(SECRET.insertintomenus, [field.number, field.title, field.description, field.price, query, field.offertime, field.category], function (err, Result) {
                        if (err) throw err;
                        console.log(Result);
                        res.status(200).send({ message: '添加成功' });
                    })
                } else {
                    res.status(419).send({ message: 'foodid重复' });
                }
            })
            pool.releaseConnection(connection);
        })
    })
    form.on('end', function () {
        console.log("接收完成");
    });
})

router.get('/loadpic', function (req, res) {
    let query = URL.parse(req.url).query;
    let param = querystring.parse(query);
    // res.writeHead(200,{'Content-Type':'image/jpg;charset=UTF8'});
    res.sendFile(path.resolve(__dirname + '../../../public/images/' + String(param.dir) + '/' + String(param.name)))
})

router.post('/delete', function (req, res) {
    console.log(req.body);
    let data = req.body;
    let param = querystring.parse(data.url);
    console.log(param);
    let pool = mysql.createPool(SECRET.database);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(SECRET.deletebyfoodid, [data.foodid], function (err, Res) {
            if (err) throw err;
            console.log(Res);
            fs.unlinkSync(path.resolve(__dirname + '../../../public/images/' + String(param.dir) + '/' + String(param.name)));
            fs.readdir(path.resolve(__dirname + '../../../public/images/' + String(param.dir)), function (err, Files) {
                if (err) throw err;
                if (Files.length === 0) {
                    fs.rmdirSync(path.resolve(__dirname + '../../../public/images/' + String(param.dir)));
                }
            })
            res.status(200).send({ message: '删除成功' })
        })
        pool.releaseConnection(connection);
    })
})

module.exports = router;