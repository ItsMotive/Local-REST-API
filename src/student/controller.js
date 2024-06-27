const { response } = require('express');
const pool = require('../../db');
const queries = require('./queries');
const c = require('./constants');
const { Validator } = require('jsonschema');

// Create a Validator instance
const validator = new Validator();

const failResponse = {
    message: "Failed to Grabbed Data"
}

// Format for expected request body
const schema = {
    type: 'object',
    properties: {
        name: { type: ['string', 'null'] },
        email: { type: ['string', 'null'], format: 'email' },
        age: { type: ['integer', 'null'], minimum: 0 },
        dob: { type: ['string', 'null'], format: 'date' }
    },
    required: ['name', 'email', 'age', 'dob']
};

const getStudents = (req, res) => {

    pool.query(queries.getStudents, (error, results) => {

        if (error) throw error;

        const response = {
            message: c.SUCCESS_FILE_GRAB,
            data: results.rows
        }

        return res.status(200).json(response);
    });
}

const getStudentById = (req, res) => {
 
    const id = parseInt(req.params.id);

    pool.query(queries.getStudentById, [id], (error, results) => {

        try {
            const successResponse = {
                message: "Successfully Grabbed Data",
                data: results.rows
            }

            if (error) throw error;

            if (results.rows.length == 0) {
                return res.status(200).json( { message: "There are no students with that Id"});
            }
    
            return res.status(200).json(successResponse);
        }
        catch (error) {
            return res.status(500).json(failResponse);
        }
    });
};

const addStudent = (req, res) => {
    const { name, email, age, dob } = req.body;

    const validation = validator.validate(req.body, schema);

    if (!validation.valid) {
        return res.status(422).json({ message: "Incorrect Request Body" } );
    }

    // Check if email exists
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (error) {
            return res.status(500).json( { message: "Error checking email." } );
        }

        if (results.rows.length) {
            return res.json({ message: "Email already exists." });
        }

        // Add student to db
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if (error) {
                return res.status(500).json( {message: "Error adding student." } )
            };

            pool.query(queries.getStudentByName, [name], (error, getResult) => {
                const response = {
                    message: "Student Successfully Created!",
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
                return res.json( {message: "Student does not exist."} )
            };

            pool.query(queries.removeStudent, [id], (error, results) => {
                if (error) throw error;
                return res.status(200).json( { message: "Student Removed Successfully!" } );
            })
        }
        catch {
            return res.status(500).json( { message: "Id is too long!" } );
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
    const validation = validator.validate(req.body, schema);

    if (!validation.valid) {
        return res.status(422).json({ message: "Incorrect Request Body" } );
    }

    // Check if student is in db
    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            return res.json( { message: "Student does not exist." } );
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
                    return res.status(500).json({ message: "Internal Server Error"} );
                };

                return res.status(200).json({ message: "Student Updated Successfully!" } );
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