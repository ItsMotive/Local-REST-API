const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "host.docker.internal",
    database: "students",
    password: "password",
    port: 5432,
});

module.exports = pool;