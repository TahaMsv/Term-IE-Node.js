const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    student_id: { type: Number },
    average: { type: Number, default: 0.0 },
    courses: { type: [Number], default: [] },
    last_update: { type: Date, default: null },
});

module.exports = mongoose.model('StudentSchema', studentSchema);