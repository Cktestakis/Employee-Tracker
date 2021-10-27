const mysql = require("mysql2");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "11112222",
    database: "employeeTrackerDB",
});

module.exports = connection;