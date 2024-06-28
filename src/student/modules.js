const pool = require('../../db');
const c = require("./constants");

/*
    Function to run queries and return response
    res = response
    SQL_QUERY = query from queries.js
    STATUS_CODE = 
*/

// Creates JSON Response Layout (Success)
function validResponse(msg, resultRows) {
    const response = {
        message: msg,
        data: resultRows
    };
    return response
};

// Creates JSON Response Layout (Failed)
function invalidResponse(msg) {
    const response = {
        message: msg
    };
    return response
}


function QueryAllStudents(res, sqlQuery) {

    pool.query(sqlQuery, (error, results) => {
        if (error) throw error;

        const response = validResponse(c.SUCCESS_FILE_GRAB, results.rows)

        // Returns Response Message
        res.status(statusCode).json(response);
    });
};

function QueryById(res, sqlQuery, studentId) {

    pool.query(sqlQuery, [studentId], (error, results) => {

        try {
            const successResponse = validResponse(c.SUCCESS_FILE_GRAB, results.rows)

            if (error) throw error;

            if (results.rows.length == 0) {
                return res.status(e.ERROR_CODE_200).json(invalidResponse(c.INVALID_STUDENT_ID));
            }
    
            return res.status(e.ERROR_CODE_200).json(successResponse);
        }
        catch (error) {
            return res.status(ERROR_CODE_500).json(invalidResponse(c.FAIL_MESSAGE));
        }
    });
}

    
module.exports = {
    QueryAllStudents
};