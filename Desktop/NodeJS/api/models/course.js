const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    course_id:{ type: Number},
    name: { type: String},
    grade: { type: Number},
});

module.exports = mongoose.model('CourseSchema', courseSchema);