const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const error = require("../utilities/errorFunction");
const Student = require("../models/student");
const Course = require("../models/course");
// const checkAuth = require("../middleware/check-auth");


router.post("/:studentid/course", async (req, res, next) => {
    const studentId = req.params.studentid;
    const { name, id, grade } = req.body;

    if (!studentId) {
        return error(res, "Student id  is empty");
    }

    const student = await (Student.findOne({ student_id: studentId }));
    if (!student) return error(res, "Student doest not exist");

    const existCourse = await (Course.findOne({ id: id }));
    if (existCourse && existCourse.name != name) return error(res, "Course with this id has another name");

    let found = false;
    const groupsList = student.courses.map(async courseid => {
        const course = await (Course.findOne({ _id: courseid }));
        if (course && course.id === id) found = true;
    });
    const list = await Promise.all(groupsList);
    if (found) { return error(res, "Course already exsit"); }
    const newCourse = await new Course({
        id,
        name, grade
    });
    newCourse.save();
    const numberOfCourses = Object.keys(student.courses).length;
    const newAverage = ((numberOfCourses * student.average) + grade) / (numberOfCourses + 1);
    student.courses.push(newCourse._id);
    student.average = newAverage;
    student.last_updated = Date.now();
    student.save();
    return res.status(200).json({
        name,
        id,
        grade,
        "code": 200,
        "message": "course added successfully!"
    }
    );
});



router.get("/:studentid", async (req, res, next) => {
    const studentId = req.params.studentid;
    console.log("here57");
    Student.find({ student_id: studentId }).select('-_id student_id average courses last_update').exec(async (err, docs) => {
        console.log("here59");
        const courseList = docs[0].courses.map(async courseid => {
            const course = await (Course.findOne({ _id: courseid }));
            console.log(course);
            const newMap = {};
            newMap.name = course.name;
            newMap.id = course.id;
            newMap.grade = course.grade;
            return newMap;
        });
        const list = await Promise.all(courseList);
        console.log("here69");
        return res.status(200).json(
            {
                "studentid": docs[0].student_id,
                "average": docs[0].average,
                "Courses": list,
                "last_updated": docs[0].last_updated,
                "code": 200,
                "message": "All courses received successfully!"
            }
        );
    });
});

router.put(":studentid/:courseid", async (req, res, next) => {
    const { name, id, grade } = req.body;
    const studentId = req.params.studentid;
    const courseId = req.params.courseid;

    return res.status(200).json({
        "message": "Put courses" + studentId + " " + courseId
    });
});

router.delete(":studentid/:courseid", async (req, res, next) => {
    const studentId = req.params.studentid;
    const courseId = req.params.courseid;

    return res.status(200).json({
        "message": "Delete courses" + studentId + " " + courseId
    });
});
module.exports = router;