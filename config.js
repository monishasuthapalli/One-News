const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

console.log(process.env.NODE_ENV);

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV : process.env.NODE_ENV || 'development',
    apiKey : process.env.apiKey || '459f6dffd625423485f6ba2c77bea075',
    dbFileName : process.env.dbFileName || 'test.sqlite'
}