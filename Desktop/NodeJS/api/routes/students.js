const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const error = require("../utilities/errorFunction");
const Student = require("../models/student");

router.post("/", async (req, res, next) => {
    const { studentid } = req.body;

    if (!studentid) {
        return error(res, "Name, email or password is empty");
    }

    const otherStudent = await (Student.findOne({ studentid }));

    if (otherStudent) return error(res, "Student id already exist");

    newStudent = new Student({
        student_id: studentid,
    });

    await newStudent.save();

    return res.status(200).json({
        "studentid": newStudent.student_id,
        "average": newStudent.student_id.average,
        "courses": newStudent.courses,
        "last_updated": newStudent.student_id.last_updated,
        "code": 200,
        "message": "student added successfully!"
    });

});

router.get("/", (req, res, next) => {
    Student.find({}).select('-_id student_id average courses last_update').exec((err, docs) => {
        const studentsListResponse = docs.map(item => {
            const newMap = {};
            newMap.studentid = item.student_id;
            newMap.Courses = item.courses;
            newMap.last_updated = item.last_update;
            return newMap;
        })
        return res.status(200).json(
            {
                "size": docs.length,
                "students": studentsListResponse,
                "code": 200,
                "message": "All students received successfully!"
            }
        );
    });

    return res.status(200).json({
        "message": "Get students"
    });
});

router.put("/:studentid", (req, res, next) => {
    const { studentid } = req.body;
    const currStudentId = req.params.studentid;
    return res.status(200).json({
        "message": "Put students " + studentId
    });
});

router.delete("/:studentid", (req, res, next) => {
    const studentId = req.params.studentid;

    return res.status(200).json({
        "message": "Delete students" + studentId
    });
});

module.exports = router;
