const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const error = require("../utilities/errorFunction");
const Student = require("../models/student");
const Course = require("../models/course");

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
    const students = await Student.find({});
    const studentsList = []
    const studentsListResolveFlag = []
    await new Promise((resolve, reject) => students.forEach(async item => {
        const newMap = {};
        newMap.studentid = item.student_id;
        newMap.average = item.average;
        const resolveFlagArray = []
        const userCourses = []
        if (Object.keys(item.courses).length > 0) {
            await new Promise((resolve, reject) => item.courses.forEach(async courseId => {
                const course = await Course.findOne({ _id: courseId }).select('-_id id name grade');
                resolveFlagArray.push(course)
                userCourses.push(course)
                if (resolveFlagArray.length === item.courses.length)
                    resolve()
            }))
        }
        newMap.courses = userCourses;
        newMap.last_update = item.last_update;
        studentsList.push(newMap)
        studentsListResolveFlag.push(newMap)
        if (studentsListResolveFlag.length === students.length)
            resolve()

    }))
    return res.status(200).json(
        {
            "size": students.length,
            "students": studentsList,
            "code": 200,
            "message": "All students received successfully!"
        }
    );
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
    const resolveFlagArray = []
    const userCourses = []
    if (Object.keys(student.courses).length > 0) {
        await new Promise((resolve, reject) => student.courses.forEach(async courseId => {
            const course = await Course.findOne({ _id: courseId }).select('-_id id name grade');
            if (course) resolveFlagArray.push(course)
            if (course) userCourses.push(course)
            if (resolveFlagArray.length === student.courses.length)
                resolve()
        }))
    }

    return res.status(200).json({
        "studentid": student.student_id,
        "average": student.average,
        "Courses": userCourses,
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


    const resolveFlagArray = []
    const userCourses = []
    console.log("here132");
    if (Object.keys(student.courses).length > 0) {
        await new Promise((resolve, reject) => student.courses.forEach(async courseId => {
            console.log("here135");
            const course = await Course.findOne({ _id: courseId }).select('-_id id name grade');
            const tempCourse = await Course.findOne({ _id: courseId });
            if (course) resolveFlagArray.push(course)
            if (course) userCourses.push(course)
            if (tempCourse) tempCourse.remove();
            if (resolveFlagArray.length === student.courses.length)
                resolve()
        }))
    }
    // console.log("here144");
    // resolveFlagArray.map(course =>{
    //     console.log("here146");
    //     console.log(course);
    //     course.remove();
    // });

    student.remove();

    
    return res.status(200).json({
        "studentid": student.student_id,
        "average": student.average,
        "Courses": userCourses,
        "last_updated": student.last_update,
        "code": 200,
        "message": "student deleted successfully!"
    }
    );
});

module.exports = router;
