// let Sequelize = require("sequelize/dist");
// let UserModel =  require('../models/user');

// const sequelizeSqlite = new Sequelize('database', 'username', 'password', {
//     dialect: 'sqlite',
//     storage: './db/users.sqlite'
// })

// const UserSqlite = UserModel(sequelizeSqlite, Sequelize);

// sequelizeSqlite.sync()
//     .then(() => {
//         console.log(`Users db and user table have been created with Sqlite`)
//     })
//     .catch((err)=>{console.log(err)});

// module.exports = UserSqlite;