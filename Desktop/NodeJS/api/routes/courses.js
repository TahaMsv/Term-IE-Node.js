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
    Student.find({ student_id: studentId }).select('-_id student_id average courses last_update').exec(async (err, docs) => {
        const courseList = docs[0].courses.map(async courseid => {
            const course = await (Course.findOne({ _id: courseid }));
            const newMap = {};
            newMap.name = course.name;
            newMap.id = course.id;
            newMap.grade = course.grade;
            return newMap;
        });
        const list = await Promise.all(courseList);
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

router.put("/:studentid/:courseid", async (req, res, next) => {
    const { name, id, grade } = req.body;
    const studentId = req.params.studentid;
    const courseId = req.params.courseid;

    if (!studentId) {
        return error(res, "Student id is empty");
    }

    const student = await (Student.findOne({ student_id: studentId }));
    if (!student) return error(res, "Student doest not exist");

    const existCourse = await (Course.findOne({ id: courseId }));
    if (!existCourse) return error(res, "Course doest not exist");

    let found = false;
    const courseList = await student.courses.map(async courseid => {
        const course = await (Course.findOne({ _id: courseid }));
        if (course && course.id == courseId) {
            const lastGrade = course.grade;
            course.name = name;
            course.id = id;
            course.grade = grade;
            course.save();
            const numberOfCourses = Object.keys(student.courses).length;
            const newAverage = ((numberOfCourses * student.average) - lastGrade + grade) / (numberOfCourses);
            student.average = newAverage;
            student.last_updated = Date.now();
            student.save();
            found = true;
            return res.status(200).json({
                name,
                id,
                grade,
                "code": 200,
                "message": "grade updated successfully!"
            });

        }
    });
    const list = await Promise.all(courseList);
    if (!found) return error(res, "Student doest not have this course");
});

router.delete("/:studentid/:courseid", async (req, res, next) => {
    const studentId = req.params.studentid;
    const courseId = req.params.courseid;

    if (!studentId) {
        return error(res, "Student id is empty");
    }

    const student = await (Student.findOne({ student_id: studentId }));
    if (!student) return error(res, "Student doest not exist");

    const existCourse = await (Course.findOne({ id: courseId }));
    if (!existCourse) return error(res, "Course doest not exist");

    let found = false;
    const courseList = await student.courses.map(async courseid => {
        const course = await (Course.findOne({ _id: courseid }));
        if (course && course.id == courseId) {
            const numberOfCourses = Object.keys(student.courses).length;
            const newAverage = ((numberOfCourses * student.average) - course.grade) / (numberOfCourses - 1);
            student.average = newAverage;
            course.remove();
            const index = student.courses.indexOf(courseid);
            if (index > -1) {
                student.courses.splice(index, 1);
            }
            student.last_updated = Date.now();
            student.save();
            found = true;
            return res.status(200).json({
                "name": course.name,
                "id": course.id,
                "grade": course.grade,
                "code": 200,
                "message": "course deleted successfully!"
            });
        }
    });
    const list = await Promise.all(courseList);
    if (!found) return error(res, "Student doest not have this course");
});
module.exports = router;