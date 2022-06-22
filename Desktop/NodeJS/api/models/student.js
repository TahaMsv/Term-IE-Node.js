const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    student_id: { type: Number },
    average: { type: Number, default: 0.0 },
    courses: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    last_update: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('StudentSchema', studentSchema);