let openDBConnection = require('../config/sqllite3').openDBConnection;
const bcrypt = require('bcrypt');

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
    getUserName() {
        return this.username
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    setUserName(username) {
        this.username = username;
    }
    setPassword(password) {
        this.password = password;
    }
    setEmail(email) {
        this.email = email;
    }
}

let getUser = async function (username) {
    try {
        let db = await openDBConnection();
        let sql = `SELECT * from users where username = ?`;
        let user = await db.get(sql, [username]);
        db.close();
        if (user == undefined)
            return null;
        return new User(user.username, user.email, user.password);
    }
    catch (err) {
        console.log("error:"+err);
    }
}

let isUserPresent = async function (username) {
    try {
        let db = await openDBConnection();
        let sql = `SELECT * from users where username = ?`;
        let user = await db.get(sql, [username]);
        db.close();
        if (user == undefined)
            return false;
        return true;
    }
    catch (err) {
        console.log(err);
    }
}

let createUser = async function (username, email, password) {
    try {
        if(await isUserPresent(username))
            return "user already present";
        let db = await openDBConnection();
        let createUserSql = `INSERT INTO users(username, email, password) VALUES(?,?,?)`;
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        let user = new User(username, email, encryptedPassword);
        await db.run(createUserSql, [user.username, user.email, user.password]);
        db.close();
        return user;
    }
    catch (err) {
        console.log(err);
    }
}

let updateUser = async function (username, email, password) {
    try {
        let db = await openDBConnection();
        let sql = `UPDATE users SET email=?, password=? WHERE username = ?`;
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        let user = new User(username, email, encryptedPassword);
        await db.run(sql, [user.email, user.password, user.username]);
        db.close();
        return user;
    }
    catch (err) {
        console.log(err);
    }
}

let deleteUser = async function (username) {
    try {
        let db = await openDBConnection();
        let sql = `DELETE from users where username=?`;
        await db.run(sql, username);
        db.close();
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    isUserPresent,
    getUser,
    deleteUser,
    updateUser,
    createUser
}