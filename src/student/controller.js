const { response } = require('express');
const pool = require('../../db');
const queries = require('./queries')

const getStudents = (req, res) => {

    pool.query(queries.getStudents, (error, results) => {

        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getStudentById = (req, res) => {

    const id = parseInt(req.params.id);

    pool.query(queries.getStudentById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    })
};

const addStudent = (req, res) => {
    const { name, email, age, dob } = req.body;

    // Check if email exists
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (results.rows.length) {
            res.send("Email already exists.")
        }

        // Add student to db
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if (error) throw error;
            res.status(201).send("Student Successful Created!");
            console.log("Student Created"); 
        });
    });
};

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
}