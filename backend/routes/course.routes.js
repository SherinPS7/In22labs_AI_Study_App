const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/user/:userId', courseController.getCoursesByUserId);
router.post('/enroll', courseController.enrollCourse);
router.get('/course/search', courseController.searchCourses);

module.exports = router;