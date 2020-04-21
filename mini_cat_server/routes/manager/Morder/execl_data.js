var express = require('express');
var router = express.Router();
var path = require('path')

router.get('/o.xlsx',function(req,res){
    
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    console.log(res);
    res.status(200).sendFile(path.resolve('./execl_data/o.xlsx'));
})

module.exports = router;