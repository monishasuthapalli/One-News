let openDBConnection = require('../config/sqllite3').openDBConnection;

class UserPreference {
    constructor(username, sourceId) {
        this.username = username;
        this.sourceId = sourceId;
    }
    getSourceId() {
        return this.sourceId;
    }
    getUserName() {
        return this.username;
    }
    setSourceId(sourceId) {
        this.sourceId = sourceId;
    }
    setUserName(username) {
        this.username = username;
    }
}

module.exports.updatePreferences = async function (preferences, username) {
    try {
        let db = await openDBConnection();
        let deleteSql = 'DELETE from user_preferences where username=?';
        await db.run(deleteSql, [username]);
        for (let i = 0; i < preferences.length; i++) {
            let createUserSql = `INSERT INTO user_preferences(username, sourceId) VALUES(?,?)`;
            await db.run(createUserSql, [username, preferences[i]]);
        }
        db.close();
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.getSourceIds = async function (username) {
    try {
        let db = await openDBConnection();
        let sql = "SELECT sourceId FROM user_preferences where username=?";
        let sourceIds = await db.all(sql, [username]);
        db.close();
        return sourceIds;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.createUserPreferences = async function (preferences, username) {
    try {
        let db = await openDBConnection();
        for (let i = 0; i < preferences.length; i++) {
            let createUserSql = `INSERT INTO user_preferences(username, sourceId) VALUES(?,?)`;
            await db.run(createUserSql, [username, preferences[i]]);
        }
        db.close();
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.deletePreferences = async function(username){
    try{
        let db = await openDBConnection();
        let createUserSql = `DELETE FROM user_preferences where username = ?`;
        await db.run(createUserSql, [username]);
        db.close();
    }
    catch(err){
        console.log(err);
    }
}

module.exports.chartData = async function () {
    try {
        let db = await openDBConnection();
        let sourcesSql = `SELECT * from sources`;
        let allSources = await db.all(sourcesSql);
        let allSourcesMap = new Map();
        for (let i = 0; i < allSources.length; i++) {
            allSourcesMap.set(allSources[i].sourceId, allSources[i].source);
        }
        let userPreferenceSql = `SELECT * from user_preferences`;
        let allPreferences = await db.all(userPreferenceSql);
        let allPreferencesMap = new Map();
        for (var i = 0; i < allPreferences.length; i++) {
            let id = allPreferences[i].sourceId;
            let sourceName = allSourcesMap.get(id);
            if (allPreferencesMap.has(sourceName)) {
                allPreferencesMap.set(sourceName, allPreferencesMap.get(sourceName) + 1);
            } else {
                allPreferencesMap.set(sourceName, 1);
            }
        }
        //console.log(allPreferencesMap);
        let userSources = [];
        let userSourceCount = [];
        var mapAsc = new Map([...allPreferencesMap].sort((a, b) => b[1] - a[1]));
        mapAsc.forEach(function (value, key) {
            userSourceCount.push(value);
            userSources.push(key);
        })
        //console.log(userSources);
        //console.log(userSourceCount);

        let allBookmarksSql = `SELECT * from bookmarks`;
        let allBookmarks = await db.all(allBookmarksSql);
        let allBookmarksMap = new Map();
        for (var i = 0; i < allBookmarks.length; i++) {
            let sourceName = allBookmarks[i].source;
            if (allBookmarksMap.has(sourceName)) {
                allBookmarksMap.set(sourceName, allBookmarksMap.get(sourceName) + 1);
            } else {
                allBookmarksMap.set(sourceName, 1);
            }
        }
        //console.log(allBookmarksMap);
        let bookMarkSources = [];
        let bookMarkSourceCount = [];
        var mapAsc = new Map([...allBookmarksMap].sort((a, b) => b[1] - a[1]));
        mapAsc.forEach(function (value, key) {
            bookMarkSourceCount.push(value);
            bookMarkSources.push(key);
        })
        //console.log(bookMarkSources);
        //console.log(bookMarkSourceCount);
        let chartData = {};
        chartData.preferenceSources = userSources;
        chartData.preferenceCount = userSourceCount;
        chartData.bookMarkSources = bookMarkSources;
        chartData.bookMarkSourceCount = bookMarkSourceCount;
        return chartData;
    }
    catch (err) {
        console.log(err);
    }
}