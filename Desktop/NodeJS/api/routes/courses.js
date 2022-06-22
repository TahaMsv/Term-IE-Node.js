const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Student = require("../models/student");
const Course = require("../models/course");
// const checkAuth = require("../middleware/check-auth");


router.post("/course",  (req, res, next) => {
    const studentId = req.params.studentid;
    const { name, id, grade } = req.body;
    return res.status(200).json({
        "message": "Post courses"+ studentId
    });
});

router.get("/",  (req, res, next) => {
    const studentId = req.params.studentid;
    
    return res.status(200).json({
        "message": "Get courses"+ studentId
    });
});

router.put("/:courseid", (req, res, next) => {
    const { name, id, grade } = req.body;
    const studentId = req.params.studentid;
    const courseId = req.params.courseid;
    
    return res.status(200).json({
        "message": "Put courses"+ studentId + " " + courseId
    });
});

router.delete("/:courseid", (req, res, next) => {
    const studentId = req.params.studentid;
    const courseId = req.params.courseid;
    
    return res.status(200).json({
        "message": "Delete courses"+ studentId + " " + courseId
    });
});
module.exports = router;