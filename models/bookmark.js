let openDBConnection = require('../config/sqllite3').openDBConnection;
class Boomark {
    constructor(username, title, imageUrl, description, url, source) {
        this.source = source;
        this.username = username;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.url = url;
    }
    getSource() {
        return this.source
    }
    setSource(source) {
        this.source = source;
    }
}

module.exports.addBookmark = async function (username, title, imageUrl, description, url, source) {
    try {
        let db = await openDBConnection();
        let bookmarksql = `INSERT INTO bookmarks VALUES(?,?,?,?,?,?)`;
        await db.run(bookmarksql, [username, title, imageUrl, description, url, source]);
        db.close();
    }
    catch (err) {
        console.log(err);
    }
}


module.exports.getBookMarks = async function(username){
    try{
        let db = await openDBConnection();
        let sql = `SELECT * from bookmarks where username=?`;
        let bookmarks = await db.all(sql, [username]);
        db.close();
        return bookmarks;
    }
    catch(err){
        console.log(err);
    }
}

module.exports.deleteBookMark = async function (username, title) {
    try {
        let db = await openDBConnection();
        let sql = `DELETE from bookmarks where username=? and title=?`;
        await db.run(sql, [username, title]);
        db.close();
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.deleteBookMarks = async function(username){
    try{
        let db = await openDBConnection();
        let sql = `DELETE from bookmarks where username=?`;
        await db.run(sql, [username]);
        db.close();
    }
    catch(err){
        console.log(err);
    }
}