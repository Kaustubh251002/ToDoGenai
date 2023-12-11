// todoModel.js
const mongoose = require('./db');

const todoSchema = new mongoose.Schema({
    _id: String,
    description: String,
    due_date: Date,
    rank: Number
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
