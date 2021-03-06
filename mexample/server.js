var { buildSchema } = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');

var auth = require('./auth');
var mongo = require('./mongo');
var User = require('./User');

var schema = buildSchema(`
  type Todo {
    id: String
    text: String
    completed: Boolean
  }

  type User {
    username: String
    todos: [Todo]
  }

  type Query {
    me: User
  }

  type Mutation {
    login(username: String, password: String): String
    signup(username: String, password: String): String
    addTodo(text: String): Todo
    deleteTodo(id: String): Boolean
  }
`);

var root = {
  login: User.login,
  signup: User.signup,
  me: User.me,
};

var app = express();
app.use(auth.middleware);
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

mongo.connect().then(() => {
  app.listen(4000);
  console.log('Running server on port 4000');
})
