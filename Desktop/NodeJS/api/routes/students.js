const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const error = require("../utilities/errorFunction");
const Student = require("../models/student");
const student = require("../models/student");

router.post("/", async (req, res, next) => {
    const { studentid } = req.body;

    if (!studentid) {
        return error(res, "Student id  is empty");
    }

    const otherStudent = await (Student.findOne({ student_id: studentid }));

    if (otherStudent) return error(res, "Student id already exist");

    newStudent = new Student({
        student_id: studentid,
    });

    await newStudent.save();

    return res.status(200).json({
        "studentid": newStudent.student_id,
        "average": newStudent.average,
        "courses": newStudent.courses,
        "last_updated": newStudent.last_update,
        "code": 200,
        "message": "student added successfully!"
    });

});

router.get("/", async (req, res, next) => {
    Student.find({}).select('-_id student_id average courses last_update').exec((err, docs) => {
        const studentsListResponse = docs.map(item => {
            const newMap = {};
            newMap.studentid = item.student_id;
            newMap.average = item.average;
            newMap.Courses = item.courses;
            newMap.last_update = item.last_update;
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

});

router.put("/:studentid", async (req, res, next) => {
    const { studentid } = req.body;
    const currStudentId = req.params.studentid;

    console.log("here66");
    if (!studentid || !currStudentId) {
        return error(res, "Student id  is empty");
    }
    const student = await (Student.findOne({ student_id: currStudentId }));
    const newStudent = await (Student.findOne({ student_id: studentid }));
    if (!student) {

        return error(res, "Student does not exist");
    }
    if (newStudent) {

        return error(res, "Student id already exist");
    }
    student.student_id = studentid;
    student.save();
    return res.status(200).json({
        "studentid": student.student_id,
        "average": student.average,
        "Courses": student.courses,
        "last_updated": student.last_update,
        "code": 200,
        "message": "studentid changed successfully!"
    }
    );
});

router.delete("/:studentid", async (req, res, next) => {
    const studentid = req.params.studentid;

    if (!studentid) {
        return error(res, "Student id  is empty");
    }

    const student = await (Student.findOne({ student_id: studentid }));

    if (!student) return error(res, "Student doest not exist");
    student.remove();

    return res.status(200).json({
        "studentid": student.student_id,
        "average": student.average,
        "Courses": student.courses,
        "last_updated": student.last_update,
        "code": 200,
        "message": "student deleted successfully!"
    }
    );
});

module.exports = router;