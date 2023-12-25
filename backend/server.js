const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { generateTodoListText } = require('./apicall');
const { MongoClient } = require('mongodb');

const databaseUrl = ''; //Your MONGODB Atlas connection URL
const collectionName = ''; //Your Collection name

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// API endpoint to get todo list items

async function connectToDatabase() {
  const client = new MongoClient(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the database');
    return client.db();
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}

async function insertTodo(email, todos) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);

  try {
    await collection.updateOne({ email }, {"$push": {todos: todos}}, {upsert: true});
    console.log(`Todos added for ${email}`);
  } catch (error) {
    console.error('Error inserting todos', error);
  } 
}

async function getTodosByEmail(email) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);

  try {
    const result = (await collection.find({email}).toArray()).map((i) => i.todos);
    console.log(1,result[0]);
    return result[0];
  } catch (error) {
    console.error('Error retrieving todos', error);
    throw error;
  } 
}

async function updateTodosByEmail(email, updatedTodos) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);

  try {
    await collection.updateOne({ email }, { $set: { todos: updatedTodos } });
    console.log(`Todos updated for ${email}`);
  } catch (error) {
    console.error('Error updating todos', error);
  } 
}

app.post('/insertTodo', async(req,res) => {
  try{
    console.log(req.body);
    const todoitem = JSON.parse(JSON.stringify(req.body.todoitem));
    if(!todoitem){
      return res.status(400).json({error: 'Item is required'});
    }
    const email = todoitem.email;
    const dbresponse = insertTodo(email,todoitem.newitem);
    res.json({dbresponse});
  }catch(error){
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.get('/todos/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const todos = await getTodosByEmail(email);
    res.json({ todos });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/updateTodo', async(req,res) => {
  try{
    console.log(req.body);
    const todoitem = JSON.parse(JSON.stringify(req.body.todoitem));
    if(!todoitem){
      return res.status(400).json({error: 'Item is required'});
    }
    const email = todoitem.email;
    const dbresponse = updateTodosByEmail(email,todoitem.todoList);
    res.json({dbresponse});
  }catch(error){
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});    
  }
});


app.post('/generateTodoListText', async (req, res) => {
  try {
    console.log(req.body);
    const todoList = JSON.parse(JSON.stringify(req.body.todoList));

    if (!todoList) {
      return res.status(400).json({ error: 'TodoList parameter is required.' });
    }

    const generatedText = await generateTodoListText(todoList);
    res.json({ generatedText: todoList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
