const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    student_id: { type: Number },
    average: { type: Number },
    courses: {  type: [Number], default: [] },
    last_update: { type: Date, default: null },
});

module.exports = mongoose.model('StudentSchema', studentSchema);