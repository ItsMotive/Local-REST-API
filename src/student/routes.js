const {Router} = require('express');

const controller = require('./controller');

const router = Router();

// Middleware to validate ID parameter
const validateId = (req, res, next) => {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    next();
};

router.get("/students", controller.getStudents);
router.post("/student", controller.addStudent);
router.get("/student/:id", validateId, controller.getStudentById);
router.put("/student/:id", validateId, controller.updateStudent);
router.delete("/student/:id", validateId, controller.removeStudent);

module.exports = router;