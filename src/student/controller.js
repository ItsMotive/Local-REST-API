const { response } = require('express');
const pool = require('../../db');
const queries = require('./queries');
const m = require('./modules')
const { Validator } = require('jsonschema');

// Create a Validator instance
const validator = new Validator();

// Retrieves full table of all students
const getStudents = (req, res) => {
    m.QueryAllStudents(res, queries.getStudents);
};

const getStudentById = (req, res) => {
    
    const id = parseInt(req.params.id);

    QueryById(res, queries.getStudentById, id);

};

const addStudent = (req, res) => {
    const { name, email, age, dob } = req.body;

    const validation = validator.validate(req.body, c.SCHEMA);

    if (!validation.valid) {
        return res.status(422).json({ message: c.INVALID_BODY_REQ } );
    }

    // Check if email exists
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (error) {
            return res.status(500).json( { message: c.EMAIL_ERROR } );
        }

        if (results.rows.length) {
            return res.json({ message: c.EMAIL_EXST });
        }

        // Add student to db
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if (error) {
                return res.status(500).json( {message: c.ADD_ERROR } )
            };

            pool.query(queries.getStudentByName, [name], (error, getResult) => {
                const response = {
                    message: c.SUCCESS_ADD,
                    data: getResult.rows
                };

                return res.status(201).json(response);

            });
        });
    });
};

const removeStudent = (req, res) => {
    const id = parseInt(req.params.id);

    // Check if student is in db
    pool.query(queries.getStudentById, [id], (error, results) => {
        
        // Catches id being too long
        try {

            const noStudentFound = !results.rows.length;
            if (noStudentFound) {
                return res.json( {message: c.INVALID_STUDENT_ID} )
            };

            pool.query(queries.removeStudent, [id], (error, results) => {
                if (error) throw error;
                return res.status(200).json( { message: c.SUCCESS_REMOVE } );
            })
        }
        catch {
            return res.status(500).json( { message: c.ID_ERROR } );
        }
    });
};

const updateStudent = (req, res) => {

    // Initialize variables for use
    var original_name;
    var original_email;
    var original_age;
    var original_dob;

    // Set variables for use
    var { name, email, age, dob } = req.body;
    const id = parseInt(req.params.id);

    // Validate the response body against the schema
    const validation = validator.validate(req.body, c.SCHEMA);

    if (!validation.valid) {
        return res.status(422).json({ message: c.INVALID_BODY_REQ } );
    }

    // Check if student is in db
    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            return res.json( { message: c.INVALID_STUDENT_ID } );
        }

        // Gets original data
        pool.query(queries.getStudentById, [id], (error, results) => {
            if (error) throw error;
            original_name = results.rows[0].name;
            original_email = results.rows[0].email;
            original_age = results.rows[0].age;
            original_dob = results.rows[0].dob;

            // Set values for query input
            name = name || original_name;
            email = email || original_email;
            age = age || original_age;
            dob = dob || original_dob;

            // Runs the UPDATE query
            pool.query(queries.updateStudent, [name, email, age, dob, id], (error, results) => {
                if (error) {
                    console.error('Error executing SQL Query', error);
                    return res.status(500).json({ message: INT_SERVER_ERROR } );
                };

                return res.status(200).json({ message: c.SUCCESS_UPDT } );
            });
        });
    });
};

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    removeStudent,
    updateStudent,
};