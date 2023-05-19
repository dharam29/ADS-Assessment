import mysql from 'mysql2';

var connection = mysql.createConnection({
    host: "localhost",
    user: "dg",
    password: 'root',
    database: "test"
})

connection.connect(function(err) {
    if(err) {
        throw err;
    }
    console.log('connected!');
});

export default connection;