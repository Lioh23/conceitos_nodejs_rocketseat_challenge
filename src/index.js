const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(400).json({ error: 'User not found' });
  }

  request.user = user;

  return next();
}

function checkExistsTodo(request, response, next) {

  const { id } = request.params;
  const { todos } = request.user;

  const indexOfTodo = todos.findIndex(todo => todo.id === id);

  if (indexOfTodo < 0) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  request.todoId = id;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  
  const { name, username } = request.body;

  const userAlreadyExists = users.some(user => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists' });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title, 
    done: false,
    deadline: new Date(deadline),
    created_at : new Date(),
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  
  // Complete aqui
  const { todoId } = request;
  const { todos } = request.user;
  const { title, deadline } = request.body;

  console.log(title, deadline, todoId);

  const todo = todos.find(todo => todo.id === todoId);

  todo.title = title;
  todo.deadline = new Date(deadline);

  console.log(todo);

  response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  
  // Complete aqui
  const { todoId } = request;
  const { todos } = request.user;

  const todo = todos.find(todo => todo.id === todoId);

  todo.done = true;

  response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  
  // Complete aqui
  const { todoId } = request;
  const { user } = request;
  const { todos } = user;
  const { indexOfTodo } = todos.findIndex(todo => todo.id === todoId);

  todos.splice(indexOfTodo, 1);

  return response.status(204).json(todos);
});

module.exports = app;