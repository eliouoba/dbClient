/**
 * This file has 2 roles:
 * sets up a database server using npm mysql2
 *      and creates a http server for browsers to connect to.
 * Connects the http server to the database
 */

/* setting up the database connection */

let connection = require('mysql2').createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dispatcher',
// multipleStatements: true (related to SQL injection)
});

connection.connect((err) => {
    if (err) return console.error('error: ' + err.message);
    console.log('Connected to the database');
});

/* setting up the server*/

const http = require('http');
const url = require('url');

const requestListener = (req, res) => {

    let getResult = (data) => {
        //allow all urls to connect to this server
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.writeHead(200)
        res.end(JSON.stringify(data))
    };

    let queryString = url.parse(req.url, true).query.queryString;
    makeQuery(queryString, getResult);
}

const server = http.createServer(requestListener);
server.listen(8080, () => console.log("Server listening on port 8080"))

const makeQuery = (queryString, getResult) => {
    connection.query(queryString, function(error, data) {
        if (error) {
            return getResult({ "error": error.message });
        } else {
            return getResult(data);
        }
    });
}