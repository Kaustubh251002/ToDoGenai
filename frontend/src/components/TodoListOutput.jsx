import React from 'react';

const TodoListOutput = ({ tasks, handleDeleteTask, handleModifyTask }) => {
  if (tasks === null || tasks === undefined) {
    return <p>No tasks available.</p>;
  }
  return (
    <div className="w-2/3 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ordered Tasks</h1>
      <ul className="list-none p-0">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded"
          >
            <div>
              <div>
                <strong>Task:</strong> {task.task}
              </div>
              <div>
                <strong>Due:</strong> {task.due}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  const modifiedTask = prompt('Modify Task:', task.task);
                  if (modifiedTask !== null) {
                    handleModifyTask(task.id, modifiedTask);
                  }
                }}
                className="p-2 bg-green-500 text-white rounded"
              >
                Modify
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListOutput;
