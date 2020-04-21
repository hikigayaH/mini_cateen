module.exports={
    tokensecret:'dfw3l/4f345g55ed',
    // user表
    selectbyuserid: 'SELECT * FROM user where `userid` = ?',
    selectbalbyuser: 'SELECT ubalance FROM user where `userid` = ?',
    insertintouser: 'insert into user (userid,upsd) value (?,?)',
    updatebalance: 'update user set ubalance = ? where userid = ?',
    updatepassword: 'update user set upsd = ? where userid = ?',
    updateinfobyid: 'update user set uname = ?,ugender = ? where userid = ?',
    selectuser: 'select * from user',
    updateubalance: 'update user set ubalance = ? where userid = ?',
    deleteuser: 'delete from user where userid = ?',

    //mamager表
    selectbymanager: 'select * from manager where `managerid` = ?',
    updatemanagerpassword: 'update manager set mpsd = ? where managerid = ?',

    //menus表
    selectdistinctcate: 'select distinct category from menus where foffertime like ?',
    //SELECT DISTINCT category FROM menus WHERE locate('早餐',foffertime)>0
    selectbyoffertime: 'select * from menus where foffertime like ? and category = ?',
    selectallbyoffertime: 'select title from menus where foffertime like ?',
    selectallmenus: 'select * from menus',
    insertintomenus: 'insert into menus (foodid,title,description,price,url,foffertime,category) value (?,?,?,?,?,?,?)',
    deletebyfoodid: 'delete from menus where foodid = ?',
    selectbyfoodid: 'select * from menus where foodid = ?',

    //bill表
    selectcount: 'select count(*) as num from bill where content like ?',
    selectfrombillbyuserid: 'select * from bill where userid = ? order by buildtime DESC',
    insertintobill: 'insert into bill(orderid,fund,buildtime,effecttime,content,userid,total_num) value (?,?,?,?,?,?,?)',
    selectallfrombill: 'select orderid,fund,buildtime,content,userid,total_num from bill',
    deletebillbyorderid: 'delete from bill where orderid = ?',
    selectbillbyorderid: 'select fund,userid from bill where orderid = ?',

    database: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mini_cateen'
      }
}