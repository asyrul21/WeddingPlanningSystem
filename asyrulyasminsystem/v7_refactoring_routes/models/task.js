var mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    progress: Number,
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;