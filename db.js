const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",

    // Used for Docker
    host: "host.docker.internal",

    // Used for Local Machine
    // host: "localhost",

    database: "students",
    password: "password",
    port: 5432,
});

module.exports = pool;