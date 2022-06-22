const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    id:{ type: Number},
    name: { type: String},
    grade: { type: Number},
});

module.exports = mongoose.model('CourseSchema', courseSchema);