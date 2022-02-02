const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require('../config.js');
let openDBConnection = async function () {
    return await open({
    filename: './db/' + config.dbFileName,
    driver: sqlite3.Database
  })
}

let createTables = async function () {
  let db = await openDBConnection();
  const sql = `
  CREATE TABLE IF NOT EXISTS users(
    username TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sources(
    sourceId INTEGER NOT NULL,
    source TEXT NOT NULL,
    PRIMARY KEY (sourceId),
    UNIQUE (source)
  );
  CREATE TABLE IF NOT EXISTS user_preferences(
    username TEXT NOT NULL,
    sourceId INT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookmarks(
    username TEXT NOT NULL, 
    title TEXT NOT NULL,
    imageUrl TEXT,
    description TEXT,
    url TEXT,
    source TEXT,
    UNIQUE(title, username)
  );
  INSERT OR IGNORE INTO sources (source)
  VALUES ('bloomberg'),('al-jazeera-english'),('abc-news'),('bbc-news'),('business-insider'),('CNN'),('Engadget'),('ESPN'),('Reuters'),('cbc-news'),('fox-news'),('google-news'),('hacker-news'),('independent'),('mashable'),('techradar'),('the-hindu'),('the-verge'),('the-washington-post'),('usa-today'),('wired'),('the-wall-street-journal')`;
  try {
    await db.exec(sql);
    db.close();
  }
  catch (err) {
    console.log("error in creating tables");
  }
}

let deleteTables = async function () {
  try {
    let db = await openDBConnection();
    const sql = `DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS user_preferences;
    DROP TABLE IF EXISTS sources;
    DROP TABLE IF EXISTS bookmarks`;
    await db.exec(sql);
    db.close();
  }
  catch (err) {
    console.log("error deleting data in tables");
    console.log(err);
  }
}
module.exports = {
  openDBConnection,
  createTables,
  deleteTables
}