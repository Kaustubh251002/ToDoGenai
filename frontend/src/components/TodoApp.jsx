import React, { useState } from 'react';
import TodoListOutput from './TodoListOutput';
import axios from 'axios';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [rank, setRank] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const parts = dateString.split('-');
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);
    const currentDate = new Date();

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return false;
    }

    const inputDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Dates

    return inputDate >= currentDate;
  };

  const getTasks = async(emailid) =>{
    const serverUrl = 'http://localhost:5000/todos/'+emailid;
    try{ 
      const response = await axios.get(serverUrl);
      if(!response.data){
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      console.log(data)
      orderTasks(JSON.parse(JSON.stringify(response.data.todos)));
    }catch(error){
      console.error(error);
    }
  }
  const orderTasks = async (todoList) => {
    const serverUrl = 'http://localhost:5000/generateTodoListText';
    console.log(1, todoList)

    try {
      const temp = [];
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todoList }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setTasks(data.generatedText || []);
      console.log(tasks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleAddTask = async(e) => {
    if (newTask.trim() === '') {
      setErrorMessage('Task cannot be empty.');
      return;
    }

    if (!isValidDate(dueDate)) {
      setErrorMessage('Invalid date format or date must be greater than or equal to the current date.');
      return;
    }

    const rankNumber = Number(rank);
    if (isNaN(rankNumber)) {
      setErrorMessage('Rank must be a number.');
      return;
    }

    const newTaskObject = {
      id: tasks.length+1,
      task: newTask,
      due: dueDate,
      rank: rankNumber,
    };

    const todoitem = {
      email: email,
      newitem: newTaskObject
    };

    try {
      const response = await axios.post('http://localhost:5000/insertTodo', {todoitem});

      if (response.ok) {
        console.log('Todo item created successfully!');
        // You can handle a successful creation, e.g., redirect or update state
      } else {
        console.error('Error creating todo item:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating todo item:', error.message);
    }
    console.log(tasks);
    
    getTasks(email);

    setErrorMessage('');
    setNewTask('');
    setRank('');
  };

  const handleDeleteTask = async(id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    const todoitem = {
      email: email,
      todoList: updatedTasks
    };
    try {
      const response = await axios.post('http://localhost:5000/updateTodo', {todoitem});

      if (response.ok) {
        console.log('Todo item deleted successfully!');
        // You can handle a successful creation, e.g., redirect or update state
      } else {
        console.error('Error deleting todo item:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo item:', error.message);
    }
  };

  const handleModifyTask = async(id, modifiedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, task: modifiedTask } : task
    );
    const todoitem = {
      email: email,
      todoList: updatedTasks
    };
    try {
      const response = await axios.post('http://localhost:5000/updateTodo', {todoitem});

      if (response.ok) {
        console.log('Todo item modified successfully!');
        // You can handle a successful creation, e.g., redirect or update state
      } else {
        console.error('Error modifying todo item:', response.statusText);
      }
    } catch (error) {
      console.error('Error modifying todo item:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[96vh] animate-gradient bg-gradient-to-r from-purple-700 via-purple-500 to-blue-900 p-4">
      {/* Input Section */}
      <div className="w-1/3 p-4 bg-white rounded shadow mr-4">
        <h1 className="text-2xl font-bold mb-4">ToDo List</h1>
        {errorMessage && (
          <div className="text-red-500 mb-2">{errorMessage}</div>
        )}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Due date (e.g., yyyy-mm-dd)"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Rank (optional)"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddTask}
            className="w-full p-2 mb-1 bg-blue-500 text-white rounded"
          >
            Add Task
          </button>
          <button
            onClick={() => orderTasks(tasks)}
            className="w-full p-2 mb-1 bg-blue-500 text-white rounded"
          >
            Order Current Tasks
          </button>
          <button
            onClick={()=>getTasks(email)}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Get Tasks for entered Email
          </button>
        </div>
      </div>

      {/* Output Section */}
      <TodoListOutput
        tasks={tasks}
        handleDeleteTask={handleDeleteTask}
        handleModifyTask={handleModifyTask}
      />
    </div>
  );
};

export default TodoApp;
