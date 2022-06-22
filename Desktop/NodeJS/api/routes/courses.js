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
    console.log("here24");
    //check if course is exist
    console.log(student.courses);

    const list = await student.courses.map(async courseid => {
        console.log(courseid);
        const course = await (Course.findOne({ _id: courseid }));
        console.log(course);
        console.log("here28");
        if (course && course.id === id) {
            console.log("here29");
            return error(res, "Course already exsit");
        }
    });
    console.log("here34");
    // add course
    const newCourse = await new Course({
        id,
        name, grade
    });
    newCourse.save();
    console.log("here41");
    // const newAverage =  ((student.courses.lenght * student.average) + grade)/student.courses.lenght;
    student.courses.push(newCourse._id);
    // student.average = newAverage;
    // student.last_updated = Date.now();
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
    Student.find({ student_id: studentId }).select('-_id student_id average courses last_update').exec((err, docs) => {
        return res.status(200).json(
            {
                "studentid": docs.student_id,
                "average": docs.average,
                "Courses": docs.courses,
                "last_updated": docs.last_updated,
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