// Success Messages
const SUCCESS_FILE_GRAB = "Successfully Grabbed Data";
const SUCCESS_ADD = "Student Successfully Created!";
const SUCCESS_REMOVE = "Student Removed Successfully!";
const SUCCESS_UPDT = "Student Updated Successfully!";
const FAIL_MESSAGE = "Failed to Grabbed Data";

// Invalid Messages
const INVALID_STUDENT_ID = "Student does not exist!";
const INVALID_BODY_REQ = "Incorrect Request Body";

// Error Messages
const EMAIL_ERROR = "Error validating email.";
const ADD_ERROR = "Error adding student.";
const ID_ERROR = "Id is too long!";

const EMAIL_EXST = "Email already exists.";

const INT_SERVER_ERROR = "Internal Server Error";

const ERROR_CODE_200 = 200;
const ERROR_CODE_500 = 500;



// Format for expected request body
const SCHEMA = {
    type: 'object',
    properties: {
        name: { type: ['string', 'null'] },
        email: { type: ['string', 'null'], format: 'email' },
        age: { type: ['integer', 'null'], minimum: 0 },
        dob: { type: ['string', 'null'], format: 'date' }
    },
    required: ['name', 'email', 'age', 'dob']
};

module.exports = {
    SUCCESS_FILE_GRAB,
    SCHEMA,
    FAIL_MESSAGE,
    INVALID_STUDENT_ID,
    INVALID_BODY_REQ,
    EMAIL_ERROR,
    EMAIL_EXST,
    ADD_ERROR,
    SUCCESS_ADD,
    SUCCESS_REMOVE,
    ID_ERROR,
    INT_SERVER_ERROR,
    SUCCESS_UPDT,
    ERROR_CODE_200,
    ERROR_CODE_500
}