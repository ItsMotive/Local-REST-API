const { response } = require('express');
const pool = require('../../db');
const queries = require('./queries')

const getStudents = (req, res) => {

    pool.query(queries.getStudents, (error, results) => {

        if (error) throw error;
        return res.status(200).json(results.rows);
    });
}

const getStudentById = (req, res) => {

    const id = parseInt(req.params.id);

    pool.query(queries.getStudentById, [id], (error, results) => {
        if (error) throw error;
        return res.status(200).json(results.rows);
    });
};

const addStudent = (req, res) => {
    const { name, email, age, dob } = req.body;

    // Check if email exists
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (error) {
            return res.status(500).send("Error checking email.");
        }

        if (results.rows.length) {
            return res.send("Email already exists.")
        }

        // Add student to db
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if (error) {
                return res.status(500).send("Error adding student.")
            };
            
            return res.status(201).send("Student Successful Created!");
        });
    });
};

const removeStudent = (req, res) => {
    const id = parseInt(req.params.id);

    // Check if student is in db
    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            return res.send("Student does not exist.")
        };

        pool.query(queries.removeStudent, [id], (error, results) => {
            if (error) throw error;
            return res.status(200).send("Student Removed Successfully!");
        })
    });
};

const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    // Check if student is in db
    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            return res.send("Student does not exist.")
        }

        pool.query(queries.updateStudent, [name, id], (error, results) => {
            if (error) throw error;
            return res.status(200).send("Student Updated Successfully!");
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